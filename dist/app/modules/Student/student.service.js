"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextStudentId = nextStudentId;
exports.listStudents = listStudents;
exports.getStudent = getStudent;
exports.createStudent = createStudent;
exports.updateStudent = updateStudent;
exports.promoteStudents = promoteStudents;
const ClassStructure_1 = require("../../../models/ClassStructure");
const Student_1 = require("../../../models/Student");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const student_utils_1 = require("./student.utils");
async function nextStudentId(classId) {
    const settings = await SchoolSettings_1.SchoolSettings.findOne();
    const year = settings?.academicYear ?? String(new Date().getFullYear());
    const klass = classId ? await ClassStructure_1.ClassStructure.findById(classId) : null;
    const prefix = `${year}-${klass?.code ?? "GEN"}`;
    const count = await Student_1.Student.countDocuments({ studentId: new RegExp(`^${prefix}`) });
    return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}
async function listStudents(query) {
    return Student_1.Student.find((0, student_utils_1.buildStudentFilter)(query)).populate("classId", "name code").sort({ createdAt: -1 }).limit(200);
}
async function getStudent(id) {
    const recordId = (0, persist_1.requireId)(id, "Student");
    const item = await Student_1.Student.findById(recordId).populate("classId", "name code sections");
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Student"));
    return item;
}
async function createStudent(input, user) {
    const studentId = String(input.studentId ?? (await nextStudentId(input.classId)));
    const exists = await Student_1.Student.findOne({ studentId });
    if (exists) {
        throw new ApiError_1.ApiError(409, messages_1.msg.duplicate("Student", "Student ID"));
    }
    const status = input.status ?? "active";
    const payload = {
        name: String(input.name),
        gender: input.gender,
        academicYear: String(input.academicYear),
        studentId,
        status,
        nameBn: String(input.nameBn ?? ""),
        phone: String(input.phone ?? ""),
        email: String(input.email ?? ""),
        classId: input.classId ? String(input.classId) : undefined,
        section: String(input.section ?? "A"),
        group: input.group ?? "None",
        previousSchool: String(input.previousSchool ?? ""),
        healthNotes: String(input.healthNotes ?? ""),
        address: input.address ?? {},
        guardian: input.guardian ?? {},
        talentTags: input.talentTags ?? [],
        photoUrl: String(input.photoUrl ?? ""),
    };
    const student = await Student_1.Student.create(payload);
    await (0, audit_service_1.writeAudit)({ user, action: "create", entity: "Student", entityId: String(student._id), after: student });
    return student;
}
async function updateStudent(id, input, user) {
    const recordId = (0, persist_1.requireId)(id, "Student");
    const payload = (0, persist_1.requirePayload)(input, "Student");
    const before = await Student_1.Student.findById(recordId);
    if (!before)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Student"));
    before.set(payload);
    if (!before.isModified()) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Student"));
    }
    await before.save();
    await (0, audit_service_1.writeAudit)({ user, action: "update", entity: "Student", entityId: recordId, before, after: before });
    return before;
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
