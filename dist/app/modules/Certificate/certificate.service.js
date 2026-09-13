"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCertificateTemplates = ensureCertificateTemplates;
exports.listTemplates = listTemplates;
exports.updateTemplate = updateTemplate;
exports.listIssued = listIssued;
exports.getIssued = getIssued;
exports.issueCertificate = issueCertificate;
const Certificate_1 = require("../../../models/Certificate");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const Student_1 = require("../../../models/Student");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const certificate_utils_1 = require("./certificate.utils");
function formatDate(value, locale = "en") {
    if (!value)
        return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        return "";
    return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB");
}
async function ensureCertificateTemplates() {
    const count = await Certificate_1.CertificateTemplate.countDocuments();
    if (count > 0)
        return;
    await Certificate_1.CertificateTemplate.insertMany(certificate_utils_1.DEFAULT_CERTIFICATE_TEMPLATES.map((item) => ({ ...item, isActive: true })));
}
async function listTemplates() {
    await ensureCertificateTemplates();
    return Certificate_1.CertificateTemplate.find().sort({ kind: 1, name: 1 });
}
async function updateTemplate(id, body) {
    const payload = body && typeof body === "object" ? { ...body } : body;
    if (payload && typeof payload === "object") {
        delete payload.kind;
    }
    return (0, persist_1.updateDocument)(Certificate_1.CertificateTemplate, id, payload, "Certificate template");
}
async function listIssued(kind, classId) {
    const filter = { revokedAt: null };
    if (classId) {
        const students = await Student_1.Student.find({ classId }).select("_id");
        filter.studentId = { $in: students.map((item) => item._id) };
    }
    if (kind) {
        if (!certificate_utils_1.CERTIFICATE_KINDS.includes(kind)) {
            throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Certificate", "Unknown certificate type."));
        }
        filter.kind = kind;
    }
    return Certificate_1.IssuedCertificate.find(filter)
        .populate({
        path: "studentId",
        select: "name nameBn studentId rollNo section group academicYear guardian classId",
        populate: { path: "classId", select: "name" },
    })
        .populate("templateId", "name kind titleBn titleEn")
        .sort({ createdAt: -1 })
        .limit(200);
}
async function getIssued(id) {
    const recordId = (0, persist_1.requireId)(id, "Certificate");
    const item = await Certificate_1.IssuedCertificate.findById(recordId)
        .populate({
        path: "studentId",
        select: "name nameBn studentId rollNo section group academicYear guardian classId dob",
        populate: { path: "classId", select: "name" },
    })
        .populate("templateId", "name kind titleBn titleEn");
    if (!item || item.revokedAt) {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Certificate"));
    }
    return item;
}
async function issueCertificate(body, user) {
    const [template, student, settings] = await Promise.all([
        Certificate_1.CertificateTemplate.findById(body.templateId),
        Student_1.Student.findById(body.studentId).populate("classId", "name"),
        SchoolSettings_1.SchoolSettings.findOne(),
    ]);
    if (!template || !template.isActive) {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Certificate template"));
    }
    if (!student) {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Student"));
    }
    if (template.kind === "transfer" && !body.leavingDate) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Certificate", "Transfer certificates need a leaving date."));
    }
    const year = settings?.academicYear ?? String(new Date().getFullYear());
    const kind = template.kind;
    const prefix = `${certificate_utils_1.CERT_PREFIX[kind]}-${(0, certificate_utils_1.escapeRegExp)(year)}-`;
    const sequence = (await Certificate_1.IssuedCertificate.countDocuments({ certNo: new RegExp(`^${prefix}`) })) + 1;
    const certNo = (0, certificate_utils_1.formatCertNo)(kind, year, sequence);
    const language = body.language === "en" ? "en" : "bn";
    const conductLabel = body.conduct === "excellent" ? (language === "bn" ? "অতি উত্তম" : "excellent") : language === "bn" ? "উত্তম" : "good";
    const className = student.classId && typeof student.classId === "object" && "name" in student.classId
        ? String(student.classId.name ?? "")
        : "";
    const values = {
        school_name: settings?.name ?? "",
        eiin: settings?.eiin ?? "",
        address: settings?.address ?? "",
        student_name: language === "bn" && student.nameBn ? student.nameBn : student.name,
        student_name_bn: student.nameBn || student.name,
        student_id: student.studentId,
        roll: student.rollNo || "",
        class: className,
        section: student.section || "",
        group: student.group && student.group !== "None" ? student.group : "",
        session: student.academicYear || year,
        father_name: student.guardian?.fatherName || "",
        mother_name: student.guardian?.motherName || "",
        issue_date: formatDate(new Date(), language),
        purpose: body.purpose?.trim() || (language === "bn" ? "প্রয়োজনীয় কাজে" : "official purposes"),
        conduct: conductLabel,
        leaving_date: formatDate(body.leavingDate, language),
        reason: body.reason?.trim() || "",
    };
    const titleSource = language === "bn" ? template.titleBn : template.titleEn;
    const bodySource = language === "bn" ? template.bodyBn : template.bodyEn;
    let created = null;
    let issuedNo = certNo;
    for (let attempt = 0; attempt < 5; attempt += 1) {
        issuedNo = (0, certificate_utils_1.formatCertNo)(kind, year, sequence + attempt);
        const merge = { ...values, cert_no: issuedNo };
        try {
            created = await Certificate_1.IssuedCertificate.create({
                certNo: issuedNo,
                templateId: template._id,
                kind,
                studentId: student._id,
                issueDate: new Date(),
                purpose: values.purpose,
                conduct: values.conduct,
                leavingDate: body.leavingDate ? new Date(body.leavingDate) : undefined,
                reason: values.reason,
                language,
                issuedByName: user?.name ?? "",
                renderedTitle: (0, certificate_utils_1.fillPlaceholders)(titleSource, merge),
                renderedBody: (0, certificate_utils_1.fillPlaceholders)(bodySource, merge),
            });
            break;
        }
        catch (err) {
            const code = err && typeof err === "object" && "code" in err ? Number(err.code) : 0;
            if (code !== 11000 || attempt === 4)
                throw err;
        }
    }
    if (!created) {
        throw new ApiError_1.ApiError(409, messages_1.msg.duplicate("Certificate", "Certificate number"));
    }
    await (0, audit_service_1.writeAudit)({
        user,
        action: "create",
        entity: "Certificate",
        entityId: String(created._id),
        after: { certNo: issuedNo, kind, studentId: String(student._id) },
    });
    return getIssued(String(created._id));
}
