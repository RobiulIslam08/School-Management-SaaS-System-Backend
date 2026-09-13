import mongoose from "mongoose";
import { FeaturePackage, normalizeModules } from "../../../models/FeaturePackage";
import { SchoolSettings } from "../../../models/SchoolSettings";
import { ClassStructure } from "../../../models/ClassStructure";
import { Student } from "../../../models/Student";
import { Result } from "../../../models/Result";
import { FeeLedger } from "../../../models/Fee";
import { Attendance } from "../../../models/Attendance";
import { Notice } from "../../../models/Notice";
import { User } from "../../../models/User";
import { Teacher } from "../../../models/Teacher";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { createStudent } from "../Student/student.service";
import { requirePublicAdmission, resolveGuardianStudentId } from "./public.utils";

export async function publicBranding() {
  const [settings, pack] = await Promise.all([SchoolSettings.findOne(), FeaturePackage.findOne()]);
  return {
    name: settings?.name ?? "School",
    logoUrl: settings?.logoUrl ?? "",
    motto: settings?.motto ?? "",
    theme: settings?.theme,
    publicAdmission: normalizeModules(pack?.modules).publicAdmission,
  };
}

export async function publicClasses() {
  await requirePublicAdmission();
  return ClassStructure.find({ isActive: true }).select("name code sections group");
}

export async function publicAdmission(body: Record<string, unknown>) {
  await requirePublicAdmission();
  return createStudent({ ...body, status: "pending" });
}

export async function guardianPortal(userId: string, role: string | undefined, queryStudentId?: string) {
  const user = await User.findById(userId);
  const linkedId = user?.linkedStudentId ? String(user.linkedStudentId) : undefined;
  if (!linkedId && role === "guardian") {
    throw new ApiError(404, msg.notFoundRead("Linked student"));
  }
  const queryId = resolveGuardianStudentId(role, linkedId, queryStudentId);
  if (!queryId) {
    return { student: null, results: [], fees: [], attendance: [], notices: [] };
  }
  if (!mongoose.isValidObjectId(queryId)) {
    throw new ApiError(400, msg.invalid("Student", "The id is invalid."));
  }
  const [student, results, fees, attendance, noticeDocs] = await Promise.all([
    Student.findById(queryId).populate("classId", "name"),
    Result.find({ studentId: queryId, deletedAt: null }).populate("examTypeId", "name isPublished"),
    FeeLedger.find({ studentId: queryId, deletedAt: null }),
    Attendance.find({ studentId: queryId }).sort({ date: -1 }).limit(30),
    Notice.find({
      isPublished: true,
      audience: { $in: ["all", "guardians", "students", "class"] },
    })
      .sort({ createdAt: -1 })
      .limit(20),
  ]);
  const visibleResults = results.filter((item) => {
    const exam = item.examTypeId as unknown as { isPublished?: boolean } | null;
    return Boolean(exam?.isPublished);
  });
  const klass = student?.classId as { _id?: unknown } | undefined;
  const classId = klass?._id ? String(klass._id) : student?.classId ? String(student.classId) : "";
  const notices = noticeDocs
    .filter((item) => item.audience !== "class" || String(item.classId ?? "") === classId)
    .slice(0, 10);
  return { student, results: visibleResults, fees, attendance, notices };
}

export async function teacherPortal(userId: string) {
  const user = await User.findById(userId);
  const teacher = user?.linkedTeacherId
    ? await Teacher.findById(user.linkedTeacherId)
        .populate({ path: "subjects", select: "name code classId", populate: { path: "classId", select: "name" } })
        .populate("classTeacherOf.classId", "name")
    : null;
  const notices = await Notice.find({ isPublished: true, audience: { $in: ["all", "teachers"] } })
    .sort({ createdAt: -1 })
    .limit(10);
  return { teacher, notices };
}
