"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listExams = listExams;
exports.createExam = createExam;
exports.publishExam = publishExam;
exports.listGradingRules = listGradingRules;
exports.createGradingRule = createGradingRule;
exports.listResults = listResults;
exports.upsertResult = upsertResult;
exports.recomputeMerit = recomputeMerit;
exports.finalGrade = finalGrade;
exports.exportResults = exportResults;
const ExamType_1 = require("../../../models/ExamType");
const GradingRule_1 = require("../../../models/GradingRule");
const Result_1 = require("../../../models/Result");
const Student_1 = require("../../../models/Student");
const Subject_1 = require("../../../models/Subject");
const grading_1 = require("../../../lib/grading");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const exam_utils_1 = require("./exam.utils");
async function listExams(academicYear) {
    return ExamType_1.ExamType.find(academicYear ? { academicYear } : {}).sort({ createdAt: -1 });
}
async function createExam(body) {
    return ExamType_1.ExamType.create(body);
}
async function publishExam(id, isPublished) {
    const exam = await ExamType_1.ExamType.findById(id);
    if (!exam)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Exam"));
    exam.isPublished = isPublished;
    await exam.save();
    return exam;
}
async function listGradingRules(academicYear) {
    return GradingRule_1.GradingRule.find(academicYear ? { academicYear } : {}).populate("weights.examTypeId", "name code");
}
async function createGradingRule(body) {
    if (!(0, exam_utils_1.weightsSumTo100)(body.weights)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Grading formula", "Weights must add up to 100."));
    }
    if (body.isDefault && !body.classId) {
        await GradingRule_1.GradingRule.updateMany({ academicYear: body.academicYear, $or: [{ classId: { $exists: false } }, { classId: null }] }, { isDefault: false });
    }
    return GradingRule_1.GradingRule.create(body);
}
async function listResults(filterInput) {
    const filter = { deletedAt: null };
    if (filterInput.examTypeId)
        filter.examTypeId = filterInput.examTypeId;
    if (filterInput.studentId)
        filter.studentId = filterInput.studentId;
    if (filterInput.classId || filterInput.section) {
        const students = await Student_1.Student.find({
            ...(filterInput.classId ? { classId: filterInput.classId } : {}),
            ...(filterInput.section ? { section: filterInput.section } : {}),
        }).select("_id");
        filter.studentId = { $in: students.map((item) => item._id) };
    }
    const items = await Result_1.Result.find(filter)
        .populate({
        path: "studentId",
        select: "name nameBn studentId rollNo section group academicYear guardian classId",
        populate: { path: "classId", select: "name code" },
    })
        .populate("examTypeId", "name code academicYear isPublished")
        .populate("subjectMarks.subjectId", "name code markDistribution sortOrder")
        .sort({ meritPosition: 1 });
    if (filterInput.publishedOnly) {
        return items.filter((item) => {
            const exam = item.examTypeId;
            return Boolean(exam?.isPublished);
        });
    }
    return items;
}
async function upsertResult(input, user) {
    const [student, exam, subjects] = await Promise.all([
        Student_1.Student.findById(input.studentId),
        ExamType_1.ExamType.findById(input.examTypeId),
        Subject_1.Subject.find({ _id: { $in: input.subjectMarks.map((item) => item.subjectId) } }),
    ]);
    if (!student || !exam) {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Student or exam"));
    }
    const rule = await (0, exam_utils_1.resolveGradingRule)(exam.academicYear, student.classId ? String(student.classId) : undefined);
    const scale = rule?.scale ?? "gpa5";
    const subjectById = new Map(subjects.map((item) => [String(item._id), item]));
    const computed = input.subjectMarks.map((row) => {
        const subject = subjectById.get(row.subjectId);
        if (!subject)
            throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Marks", "Unknown subject in marks."));
        const graded = (0, grading_1.subjectResult)(row, subject.markDistribution, scale);
        return { ...row, ...graded, subjectId: row.subjectId };
    });
    const existing = await Result_1.Result.findOne({ studentId: input.studentId, examTypeId: input.examTypeId, deletedAt: null });
    const bySubject = new Map();
    if (existing) {
        for (const row of existing.subjectMarks) {
            bySubject.set(String(row.subjectId), row);
        }
    }
    for (const row of computed) {
        bySubject.set(String(row.subjectId), row);
    }
    const merged = Array.from(bySubject.values());
    const totalObtained = merged.reduce((sum, row) => sum + (row.obtained ?? 0), 0);
    const totalFull = merged.reduce((sum, row) => sum + (row.full ?? 0), 0);
    const gpa = merged.length === 0
        ? 0
        : Math.round((merged.reduce((sum, row) => sum + (row.gpa ?? 0), 0) / merged.length) * 100) / 100;
    const letter = merged.some((row) => row.letter === "F") ? "F" : merged[0]?.letter ?? "";
    const payload = {
        studentId: input.studentId,
        examTypeId: input.examTypeId,
        academicYear: exam.academicYear,
        subjectMarks: merged,
        totalObtained,
        totalFull,
        gpa,
        letter,
    };
    if (existing) {
        existing.history.push({
            version: existing.version,
            subjectMarks: existing.subjectMarks,
            totalObtained: existing.totalObtained,
            gpa: existing.gpa,
            at: new Date(),
        });
        existing.set(payload);
        existing.version += 1;
        await existing.save();
        await (0, audit_service_1.writeAudit)({ user, action: "update", entity: "Result", entityId: String(existing._id), after: payload });
        return { record: existing, created: false };
    }
    const created = await Result_1.Result.create(payload);
    await (0, audit_service_1.writeAudit)({ user, action: "create", entity: "Result", entityId: String(created._id), after: payload });
    return { record: created, created: true };
}
async function recomputeMerit(examTypeId) {
    if (!examTypeId)
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Merit list", "Exam id is missing."));
    const exam = await ExamType_1.ExamType.findById(examTypeId);
    if (!exam)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Merit list"));
    const rule = await GradingRule_1.GradingRule.findOne({ academicYear: exam.academicYear, isDefault: true });
    const tieBreak = (rule?.tieBreak ?? ["totalMarks", "gpa", "cq"]);
    const rows = await Result_1.Result.find({ examTypeId, deletedAt: null });
    if (!rows.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Merit list", "No saved marks were found for this exam."));
    }
    const meritRows = rows.map((row) => ({
        studentId: String(row.studentId),
        totalMarks: row.totalObtained,
        gpa: row.gpa,
        cq: row.subjectMarks.reduce((sum, item) => sum + (item.cq ?? 0), 0),
        attendance: row.subjectMarks.reduce((sum, item) => sum + (item.attendance ?? 0), 0),
    }));
    const ranked = (0, grading_1.rankStudents)(meritRows, tieBreak);
    await Promise.all(ranked.map((row, index) => Result_1.Result.updateOne({ studentId: row.studentId, examTypeId, deletedAt: null }, { meritPosition: index + 1 })));
    return ranked.map((row, index) => ({ ...row, position: index + 1 }));
}
async function finalGrade(studentId, academicYear) {
    const rule = await GradingRule_1.GradingRule.findOne({ academicYear, isDefault: true });
    if (!rule || !rule.weights.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Final grade", "No default grading formula is saved for this year."));
    }
    const results = await Result_1.Result.find({ studentId, academicYear, deletedAt: null });
    const parts = rule.weights.map((weight) => {
        const match = results.find((item) => String(item.examTypeId) === String(weight.examTypeId));
        return { score: match?.gpa ?? 0, weight: weight.weight };
    });
    return { finalGpa: (0, grading_1.weightedFinal)(parts), parts };
}
async function exportResults(examTypeId) {
    if (!examTypeId)
        throw new ApiError_1.ApiError(400, messages_1.msg.notFoundRead("Exam"));
    return Result_1.Result.find({ examTypeId, deletedAt: null }).populate("studentId", "name studentId").sort({ meritPosition: 1 });
}
