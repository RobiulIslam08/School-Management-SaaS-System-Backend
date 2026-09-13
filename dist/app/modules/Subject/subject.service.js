"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubjects = listSubjects;
exports.createSubject = createSubject;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
exports.reorderSubjects = reorderSubjects;
exports.assignTeacher = assignTeacher;
const Subject_1 = require("../../../models/Subject");
const Teacher_1 = require("../../../models/Teacher");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const subject_utils_1 = require("./subject.utils");
async function listSubjects(classId) {
    return Subject_1.Subject.find(classId ? { classId } : {})
        .populate("classId", "name code")
        .populate("teacherId", "name staffId")
        .sort({ sortOrder: 1, name: 1 });
}
async function createSubject(body) {
    const max = await Subject_1.Subject.findOne({ classId: body.classId }).sort({ sortOrder: -1 }).select("sortOrder");
    return Subject_1.Subject.create({
        ...body,
        sortOrder: body.sortOrder ?? (0, subject_utils_1.nextSortOrder)(max?.sortOrder),
        compulsory: body.compulsory ?? true,
    });
}
async function updateSubject(id, body) {
    return (0, persist_1.updateDocument)(Subject_1.Subject, id, body, "Subject");
}
async function deleteSubject(id) {
    const recordId = (0, persist_1.requireId)(id, "Subject");
    const item = await Subject_1.Subject.findByIdAndDelete(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Subject"));
    return { deleted: true };
}
async function reorderSubjects(classId, orderedIds) {
    await Promise.all(orderedIds.map((id, index) => Subject_1.Subject.updateOne({ _id: id, classId }, { sortOrder: index })));
    return listSubjects(classId);
}
async function assignTeacher(id, teacherId) {
    const recordId = (0, persist_1.requireId)(id, "Subject");
    const subject = await Subject_1.Subject.findById(recordId);
    if (!subject)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Subject"));
    const previous = subject.teacherId ? String(subject.teacherId) : undefined;
    subject.teacherId = teacherId ? teacherId : undefined;
    await subject.save();
    if (previous) {
        await Teacher_1.Teacher.updateOne({ _id: previous }, { $pull: { subjects: subject._id } });
    }
    if (teacherId) {
        await Teacher_1.Teacher.updateOne({ _id: teacherId }, { $addToSet: { subjects: subject._id } });
    }
    return subject.populate("teacherId", "name staffId");
}
