"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextStudentId = nextStudentId;
exports.listStudents = listStudents;
exports.getStudent = getStudent;
exports.createStudent = createStudent;
exports.updateStudent = updateStudent;
exports.promoteStudents = promoteStudents;
exports.promoteAllStudents = promoteAllStudents;
exports.studentSaveMessage = studentSaveMessage;
const ClassStructure_1 = require("../../../models/ClassStructure");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const Student_1 = require("../../../models/Student");
const dispatch_1 = require("../../../lib/sms/dispatch");
const phone_1 = require("../../../lib/sms/phone");
const templates_1 = require("../../../lib/sms/templates");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const class_utils_1 = require("../Class/class.utils");
const student_promote_1 = require("./student.promote");
const student_utils_1 = require("./student.utils");
async function nextStudentId(classId, academicYear) {
    const classes = await ClassStructure_1.ClassStructure.find().select("code level").lean();
    const refs = classes.map((row) => ({
        id: String(row._id),
        code: row.code,
        level: row.level,
    }));
    const prefix = (0, student_utils_1.prefixForClass)(refs, classId, academicYear);
    const rows = await Student_1.Student.find({ studentId: new RegExp(`^${prefix}\\d+$`) }).select("studentId").lean();
    return (0, student_utils_1.formatStudentId)(prefix, (0, student_utils_1.nextSerialForPrefix)(rows.map((row) => row.studentId), prefix));
}
async function listStudents(query) {
    return Student_1.Student.find((0, student_utils_1.buildStudentFilter)(query)).populate("classId", "name code").sort({ createdAt: -1 }).limit(200);
}
async function getStudent(id) {
    const recordId = (0, persist_1.requireId)(id, "Student");
    const item = await Student_1.Student.findById(recordId).populate("classId", "name code sections group");
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Student"));
    return item;
}
async function classNameFor(classId) {
    if (!classId)
        return "";
    const row = await ClassStructure_1.ClassStructure.findById(String(classId)).select("name").lean();
    return row?.name ?? "";
}
async function sendAdmissionSms(student) {
    if (student.status !== "active")
        return (0, dispatch_1.emptySmsSummary)();
    if (!(await (0, dispatch_1.isSmsTriggerEnabled)("admission")))
        return (0, dispatch_1.emptySmsSummary)();
    const to = (0, phone_1.guardianNotifyPhone)(student.guardian);
    if (!to)
        return { sent: 0, failed: 0, skipped: 1 };
    const schoolName = await (0, dispatch_1.getSmsSchoolName)();
    const className = await classNameFor(student.classId);
    const body = (0, templates_1.admissionSuccessSms)({
        schoolName,
        studentName: student.nameBn || student.name,
        studentId: student.studentId,
        className: className || undefined,
    });
    return (0, dispatch_1.dispatchSms)([
        {
            to,
            body,
            template: "admission_success",
            audience: "guardian",
        },
    ]);
}
function isDuplicateKey(error) {
    return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}
async function createStudent(input, user) {
    const suppliedId = input.studentId ? String(input.studentId) : "";
    const status = input.status ?? "active";
    const dobRaw = input.dob ? String(input.dob) : "";
    const payload = {
        name: String(input.name),
        gender: input.gender,
        academicYear: String(input.academicYear),
        studentId: suppliedId,
        status,
        nameBn: String(input.nameBn ?? ""),
        phone: String(input.phone ?? ""),
        email: String(input.email ?? ""),
        classId: input.classId ? String(input.classId) : undefined,
        section: String(input.section ?? "A"),
        group: input.group ?? "None",
        previousSchool: String(input.previousSchool ?? ""),
        healthNotes: String(input.healthNotes ?? ""),
        bloodGroup: String(input.bloodGroup ?? ""),
        religion: String(input.religion ?? ""),
        birthRegNo: String(input.birthRegNo ?? ""),
        dob: dobRaw ? new Date(dobRaw) : undefined,
        rollNo: String(input.rollNo ?? ""),
        address: input.address ?? {},
        permanentAddress: input.permanentAddress ?? {},
        guardian: input.guardian ?? {},
        talentTags: input.talentTags ?? [],
        photoUrl: String(input.photoUrl ?? ""),
    };
    for (let attempt = 0; attempt < 3; attempt += 1) {
        const studentId = suppliedId ||
            (await nextStudentId(input.classId, input.academicYear));
        const exists = await Student_1.Student.findOne({ studentId }).select("_id");
        if (exists) {
            if (suppliedId || attempt === 2)
                throw new ApiError_1.ApiError(409, messages_1.msg.duplicate("Student", "Student ID"));
            continue;
        }
        try {
            const student = await Student_1.Student.create({ ...payload, studentId });
            await (0, audit_service_1.writeAudit)({ user, action: "create", entity: "Student", entityId: String(student._id), after: student });
            const sms = await sendAdmissionSms(student);
            return { student, sms };
        }
        catch (error) {
            if (suppliedId || attempt === 2 || !isDuplicateKey(error))
                throw error;
        }
    }
    throw new ApiError_1.ApiError(409, messages_1.msg.duplicate("Student", "Student ID"));
}
async function updateStudent(id, input, user) {
    const recordId = (0, persist_1.requireId)(id, "Student");
    const payload = (0, persist_1.requirePayload)(input, "Student");
    const before = await Student_1.Student.findById(recordId);
    if (!before)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Student"));
    const wasActive = before.status === "active";
    before.set(payload);
    if (!before.isModified()) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Student"));
    }
    await before.save();
    await (0, audit_service_1.writeAudit)({ user, action: "update", entity: "Student", entityId: recordId, before, after: before });
    const becameActive = !wasActive && before.status === "active";
    const sms = becameActive ? await sendAdmissionSms(before) : (0, dispatch_1.emptySmsSummary)();
    return { student: before, sms };
}
async function promoteStudents(ids, targetClassId, targetSection, user) {
    if (!ids?.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Student", "No student ids were sent."));
    }
    const result = await Student_1.Student.updateMany({ _id: { $in: ids } }, { $set: { classId: targetClassId, section: targetSection } });
    if (!result.matchedCount) {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Student"));
    }
    if (!result.modifiedCount) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Student"));
    }
    await (0, audit_service_1.writeAudit)({
        user,
        action: "promote",
        entity: "Student",
        after: { ids, targetClassId, targetSection, matched: result.modifiedCount },
    });
    return result;
}
async function promoteAllStudents(user) {
    const [classRows, studentRows, settings] = await Promise.all([
        ClassStructure_1.ClassStructure.find().select("level group sections isActive").lean(),
        Student_1.Student.find({ status: "active" }).select("classId section group").lean(),
        SchoolSettings_1.SchoolSettings.findOne(),
    ]);
    if (!studentRows.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Student promotion", "There are no active students."));
    }
    const classes = classRows.map((row) => ({
        id: String(row._id),
        level: Number(row.level),
        group: String(row.group ?? "None"),
        sections: (0, class_utils_1.sectionNames)(row.sections),
        active: row.isActive !== false,
    }));
    const students = studentRows.map((row) => ({
        id: String(row._id),
        classId: row.classId ? String(row.classId) : "",
        section: String(row.section ?? ""),
        group: String(row.group ?? "None"),
    }));
    const decisions = (0, student_promote_1.planPromotion)(students, classes);
    const moves = decisions.filter((item) => item.kind === "move");
    const alumni = decisions.filter((item) => item.kind === "alumni");
    const skipped = decisions.filter((item) => item.kind === "skip");
    const nextYear = moves.length || alumni.length ? (0, student_promote_1.nextAcademicYear)(settings?.academicYear) : null;
    const ops = [
        ...moves.map((item) => ({
            updateOne: {
                filter: { _id: item.studentId, status: "active" },
                update: {
                    $set: {
                        classId: item.classId,
                        section: item.section,
                        group: item.group,
                        ...(nextYear ? { academicYear: nextYear } : {}),
                    },
                },
            },
        })),
        ...alumni.map((item) => ({
            updateOne: {
                filter: { _id: item.studentId, status: "active" },
                update: { $set: { status: "alumni" } },
            },
        })),
    ];
    if (ops.length)
        await Student_1.Student.bulkWrite(ops);
    let academicYear = settings?.academicYear ?? "";
    if (nextYear && settings) {
        settings.academicYear = nextYear;
        await settings.save();
        academicYear = nextYear;
    }
    await (0, audit_service_1.writeAudit)({
        user,
        action: "promote",
        entity: "Student",
        after: { promoted: moves.length, alumni: alumni.length, skipped: skipped.length, academicYear },
    });
    return {
        promoted: moves.length,
        alumni: alumni.length,
        skipped: skipped.length,
        academicYear,
        yearAdvanced: Boolean(nextYear),
    };
}
function studentSaveMessage(action, sms) {
    const base = action === "saved" ? messages_1.msg.saved("Student") : messages_1.msg.updated("Student");
    return `${base}${(0, dispatch_1.smsNote)(sms)}`.trim();
}
