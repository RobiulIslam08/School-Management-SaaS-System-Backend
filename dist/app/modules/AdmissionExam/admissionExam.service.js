"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdmissionExams = listAdmissionExams;
exports.createAdmissionExam = createAdmissionExam;
exports.updateAdmissionExam = updateAdmissionExam;
exports.deleteAdmissionExam = deleteAdmissionExam;
exports.publishAdmissionExam = publishAdmissionExam;
exports.listAdmissionResults = listAdmissionResults;
exports.upsertAdmissionResult = upsertAdmissionResult;
exports.bulkSaveAdmissionResults = bulkSaveAdmissionResults;
exports.searchPublicAdmissionResult = searchPublicAdmissionResult;
const AdmissionExam_1 = require("../../../models/AdmissionExam");
const AdmissionExamResult_1 = require("../../../models/AdmissionExamResult");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function listAdmissionExams(academicYear) {
    const query = academicYear ? { academicYear } : {};
    return AdmissionExam_1.AdmissionExam.find(query).sort({ createdAt: -1 });
}
async function createAdmissionExam(body) {
    return AdmissionExam_1.AdmissionExam.create(body);
}
async function updateAdmissionExam(id, body) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Admission Exam", "ID is required."));
    const exam = await AdmissionExam_1.AdmissionExam.findById(id);
    if (!exam)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Admission Exam"));
    Object.assign(exam, body);
    await exam.save();
    return exam;
}
async function deleteAdmissionExam(id) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Admission Exam", "ID is required."));
    const exam = await AdmissionExam_1.AdmissionExam.findByIdAndDelete(id);
    if (!exam)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Admission Exam"));
    await AdmissionExamResult_1.AdmissionExamResult.deleteMany({ examId: id });
    return { deleted: true };
}
async function publishAdmissionExam(id, isPublished) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Admission Exam", "ID is required."));
    const exam = await AdmissionExam_1.AdmissionExam.findById(id);
    if (!exam)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Admission Exam"));
    exam.isPublished = isPublished;
    await exam.save();
    return exam;
}
async function listAdmissionResults(examId) {
    if (!examId)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Admission Results", "Exam ID is required."));
    return AdmissionExamResult_1.AdmissionExamResult.find({ examId }).sort({ marks: -1, roll: 1 });
}
async function upsertAdmissionResult(examId, body) {
    if (!examId)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Admission Result", "Exam ID is required."));
    const exam = await AdmissionExam_1.AdmissionExam.findById(examId);
    if (!exam)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Admission Exam"));
    const autoStatus = body.status ?? (body.marks >= exam.passMark ? "pass" : "fail");
    const updated = await AdmissionExamResult_1.AdmissionExamResult.findOneAndUpdate({ examId, roll: body.roll.trim() }, {
        ...body,
        roll: body.roll.trim(),
        status: autoStatus,
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return updated;
}
async function bulkSaveAdmissionResults(examId, items) {
    if (!examId)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Admission Result", "Exam ID is required."));
    const exam = await AdmissionExam_1.AdmissionExam.findById(examId);
    if (!exam)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Admission Exam"));
    const results = [];
    for (const item of items) {
        if (!item.roll || !item.applicantName)
            continue;
        const status = item.status ?? (item.marks >= exam.passMark ? "pass" : "fail");
        const doc = await AdmissionExamResult_1.AdmissionExamResult.findOneAndUpdate({ examId, roll: item.roll.trim() }, { ...item, roll: item.roll.trim(), status }, { upsert: true, new: true, setDefaultsOnInsert: true });
        results.push(doc);
    }
    return results;
}
async function searchPublicAdmissionResult(params) {
    if (!params.roll && !params.phone) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Search", "Roll number or phone number is required."));
    }
    // Find all published admission exams
    const publishedExams = await AdmissionExam_1.AdmissionExam.find({ isPublished: true }).select("_id name academicYear totalMark passMark className");
    const publishedIds = publishedExams.map((e) => e._id);
    const query = {
        examId: params.examId ? params.examId : { $in: publishedIds },
    };
    if (params.roll) {
        query.roll = params.roll.trim();
    }
    if (params.phone) {
        query.phone = params.phone.trim();
    }
    const results = await AdmissionExamResult_1.AdmissionExamResult.find(query)
        .populate("examId", "name academicYear totalMark passMark className isPublished")
        .sort({ createdAt: -1 });
    // Filter only those whose exam is published
    return results.filter((r) => {
        const ex = r.examId;
        return ex && ex.isPublished;
    });
}
