import {
  CertificateTemplate,
  IssuedCertificate,
  type CertificateTemplateDoc,
} from "../../../models/Certificate";
import { SchoolSettings } from "../../../models/SchoolSettings";
import { Student } from "../../../models/Student";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId, updateDocument } from "../../../utils/persist";
import type { IssueCertificateBody } from "./certificate.interface";
import {
  CERT_PREFIX,
  CERTIFICATE_KINDS,
  DEFAULT_CERTIFICATE_TEMPLATES,
  escapeRegExp,
  fillPlaceholders,
  formatCertNo,
  type CertificateKind,
} from "./certificate.utils";

function formatDate(value?: Date | string | null, locale: "bn" | "en" = "en"): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB");
}

export async function ensureCertificateTemplates(): Promise<void> {
  const count = await CertificateTemplate.countDocuments();
  if (count > 0) return;
  await CertificateTemplate.insertMany(DEFAULT_CERTIFICATE_TEMPLATES.map((item) => ({ ...item, isActive: true })));
}

export async function listTemplates(): Promise<CertificateTemplateDoc[]> {
  await ensureCertificateTemplates();
  return CertificateTemplate.find().sort({ kind: 1, name: 1 });
}

export async function updateTemplate(id: string | undefined, body: unknown): Promise<CertificateTemplateDoc> {
  const payload =
    body && typeof body === "object" ? { ...(body as Record<string, unknown>) } : body;
  if (payload && typeof payload === "object") {
    delete (payload as { kind?: unknown }).kind;
  }
  return updateDocument(CertificateTemplate, id, payload, "Certificate template");
}

export async function listIssued(kind?: string, classId?: string) {
  const filter: Record<string, unknown> = { revokedAt: null };
  if (classId) {
    const students = await Student.find({ classId }).select("_id");
    filter.studentId = { $in: students.map((item) => item._id) };
  }
  if (kind) {
    if (!CERTIFICATE_KINDS.includes(kind as CertificateKind)) {
      throw new ApiError(400, msg.invalid("Certificate", "Unknown certificate type."));
    }
    filter.kind = kind;
  }
  return IssuedCertificate.find(filter)
    .populate({
      path: "studentId",
      select: "name nameBn studentId rollNo section group academicYear guardian classId",
      populate: { path: "classId", select: "name" },
    })
    .populate("templateId", "name kind titleBn titleEn")
    .sort({ createdAt: -1 })
    .limit(200);
}

export async function getIssued(id: string | undefined) {
  const recordId = requireId(id, "Certificate");
  const item = await IssuedCertificate.findById(recordId)
    .populate({
      path: "studentId",
      select: "name nameBn studentId rollNo section group academicYear guardian classId dob",
      populate: { path: "classId", select: "name" },
    })
    .populate("templateId", "name kind titleBn titleEn");
  if (!item || item.revokedAt) {
    throw new ApiError(404, msg.notFoundRead("Certificate"));
  }
  return item;
}

export async function issueCertificate(body: IssueCertificateBody, user?: AuthUser) {
  const [template, student, settings] = await Promise.all([
    CertificateTemplate.findById(body.templateId),
    Student.findById(body.studentId).populate("classId", "name"),
    SchoolSettings.findOne(),
  ]);
  if (!template || !template.isActive) {
    throw new ApiError(404, msg.notFoundRead("Certificate template"));
  }
  if (!student) {
    throw new ApiError(404, msg.notFoundRead("Student"));
  }

  if (template.kind === "transfer" && !body.leavingDate) {
    throw new ApiError(400, msg.invalid("Certificate", "Transfer certificates need a leaving date."));
  }

  const year = settings?.academicYear ?? String(new Date().getFullYear());
  const kind = template.kind as CertificateKind;
  const prefix = `${CERT_PREFIX[kind]}-${escapeRegExp(year)}-`;
  const sequence = (await IssuedCertificate.countDocuments({ certNo: new RegExp(`^${prefix}`) })) + 1;
  const certNo = formatCertNo(kind, year, sequence);
  const language = body.language === "en" ? "en" : "bn";
  const conductLabel =
    body.conduct === "excellent" ? (language === "bn" ? "অতি উত্তম" : "excellent") : language === "bn" ? "উত্তম" : "good";
  const className =
    student.classId && typeof student.classId === "object" && "name" in student.classId
      ? String((student.classId as { name?: string }).name ?? "")
      : "";
  const values: Record<string, string> = {
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
  let created: { _id: unknown } | null = null;
  let issuedNo = certNo;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    issuedNo = formatCertNo(kind, year, sequence + attempt);
    const merge = { ...values, cert_no: issuedNo };
    try {
      created = await IssuedCertificate.create({
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
        renderedTitle: fillPlaceholders(titleSource, merge),
        renderedBody: fillPlaceholders(bodySource, merge),
      });
      break;
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? Number(err.code) : 0;
      if (code !== 11000 || attempt === 4) throw err;
    }
  }
  if (!created) {
    throw new ApiError(409, msg.duplicate("Certificate", "Certificate number"));
  }
  await writeAudit({
    user,
    action: "create",
    entity: "Certificate",
    entityId: String(created._id),
    after: { certNo: issuedNo, kind, studentId: String(student._id) },
  });
  return getIssued(String(created._id));
}
