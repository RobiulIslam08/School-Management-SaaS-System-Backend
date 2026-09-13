"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicBranding = publicBranding;
exports.publicClasses = publicClasses;
exports.publicAdmission = publicAdmission;
exports.guardianPortal = guardianPortal;
exports.teacherPortal = teacherPortal;
const mongoose_1 = __importDefault(require("mongoose"));
const FeaturePackage_1 = require("../../../models/FeaturePackage");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const ClassStructure_1 = require("../../../models/ClassStructure");
const Student_1 = require("../../../models/Student");
const Result_1 = require("../../../models/Result");
const Fee_1 = require("../../../models/Fee");
const Attendance_1 = require("../../../models/Attendance");
const Notice_1 = require("../../../models/Notice");
const User_1 = require("../../../models/User");
const Teacher_1 = require("../../../models/Teacher");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const student_service_1 = require("../Student/student.service");
const public_utils_1 = require("./public.utils");
async function publicBranding() {
    const [settings, pack] = await Promise.all([SchoolSettings_1.SchoolSettings.findOne(), FeaturePackage_1.FeaturePackage.findOne()]);
    return {
        name: settings?.name ?? "School",
        logoUrl: settings?.logoUrl ?? "",
        motto: settings?.motto ?? "",
        theme: settings?.theme,
        publicAdmission: (0, FeaturePackage_1.normalizeModules)(pack?.modules).publicAdmission,
    };
}
async function publicClasses() {
    await (0, public_utils_1.requirePublicAdmission)();
    return ClassStructure_1.ClassStructure.find({ isActive: true }).select("name code sections group");
}
async function publicAdmission(body) {
    await (0, public_utils_1.requirePublicAdmission)();
    return (0, student_service_1.createStudent)({ ...body, status: "pending" });
}
async function guardianPortal(userId, role, queryStudentId) {
    const user = await User_1.User.findById(userId);
    const linkedId = user?.linkedStudentId ? String(user.linkedStudentId) : undefined;
    if (!linkedId && role === "guardian") {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Linked student"));
    }
    const queryId = (0, public_utils_1.resolveGuardianStudentId)(role, linkedId, queryStudentId);
    if (!queryId) {
        return { student: null, results: [], fees: [], attendance: [], notices: [] };
    }
    if (!mongoose_1.default.isValidObjectId(queryId)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Student", "The id is invalid."));
    }
    const [student, results, fees, attendance, noticeDocs] = await Promise.all([
        Student_1.Student.findById(queryId).populate("classId", "name"),
        Result_1.Result.find({ studentId: queryId, deletedAt: null }).populate("examTypeId", "name isPublished"),
        Fee_1.FeeLedger.find({ studentId: queryId, deletedAt: null }),
        Attendance_1.Attendance.find({ studentId: queryId }).sort({ date: -1 }).limit(30),
        Notice_1.Notice.find({
            isPublished: true,
            audience: { $in: ["all", "guardians", "students", "class"] },
        })
            .sort({ createdAt: -1 })
            .limit(20),
    ]);
    const visibleResults = results.filter((item) => {
        const exam = item.examTypeId;
        return Boolean(exam?.isPublished);
    });
    const klass = student?.classId;
    const classId = klass?._id ? String(klass._id) : student?.classId ? String(student.classId) : "";
    const notices = noticeDocs
        .filter((item) => item.audience !== "class" || String(item.classId ?? "") === classId)
        .slice(0, 10);
    return { student, results: visibleResults, fees, attendance, notices };
}
async function teacherPortal(userId) {
    const user = await User_1.User.findById(userId);
    const teacher = user?.linkedTeacherId
        ? await Teacher_1.Teacher.findById(user.linkedTeacherId)
            .populate({ path: "subjects", select: "name code classId", populate: { path: "classId", select: "name" } })
            .populate("classTeacherOf.classId", "name")
        : null;
    const notices = await Notice_1.Notice.find({ isPublished: true, audience: { $in: ["all", "teachers"] } })
        .sort({ createdAt: -1 })
        .limit(10);
    return { teacher, notices };
}
