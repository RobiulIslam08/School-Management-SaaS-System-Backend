import { ClassStructure } from "../../../models/ClassStructure";
import { Student, type StudentDoc } from "../../../models/Student";
import { SchoolSettings } from "../../../models/SchoolSettings";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId, requirePayload } from "../../../utils/persist";
import { buildStudentFilter } from "./student.utils";

export async function nextStudentId(classId?: string): Promise<string> {
  const settings = await SchoolSettings.findOne();
  const year = settings?.academicYear ?? String(new Date().getFullYear());
  const klass = classId ? await ClassStructure.findById(classId) : null;
  const prefix = `${year}-${klass?.code ?? "GEN"}`;
  const count = await Student.countDocuments({ studentId: new RegExp(`^${prefix}`) });
  return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}

export async function listStudents(query: Record<string, unknown>) {
  return Student.find(buildStudentFilter(query)).populate("classId", "name code").sort({ createdAt: -1 }).limit(200);
}

export async function getStudent(id: string | undefined) {
  const recordId = requireId(id, "Student");
  const item = await Student.findById(recordId).populate("classId", "name code sections");
  if (!item) throw new ApiError(404, msg.notFoundRead("Student"));
  return item;
}

export async function createStudent(input: Record<string, unknown>, user?: AuthUser) {
  const studentId = String(input.studentId ?? (await nextStudentId(input.classId as string | undefined)));
  const exists = await Student.findOne({ studentId });
  if (exists) {
    throw new ApiError(409, msg.duplicate("Student", "Student ID"));
  }
  const status = (input.status as "pending" | "active" | "alumni" | "transferred") ?? "active";
  const payload = {
    name: String(input.name),
    gender: input.gender as "male" | "female" | "other",
    academicYear: String(input.academicYear),
    studentId,
    status,
    nameBn: String(input.nameBn ?? ""),
    phone: String(input.phone ?? ""),
    email: String(input.email ?? ""),
    classId: input.classId ? String(input.classId) : undefined,
    section: String(input.section ?? "A"),
    group: (input.group as "Science" | "Business" | "Humanities" | "None") ?? "None",
    previousSchool: String(input.previousSchool ?? ""),
    healthNotes: String(input.healthNotes ?? ""),
    address: (input.address as StudentDoc["address"]) ?? {},
    guardian: (input.guardian as StudentDoc["guardian"]) ?? {},
    talentTags: (input.talentTags as string[]) ?? [],
    photoUrl: String(input.photoUrl ?? ""),
  };
  const student = await Student.create(payload);
  await writeAudit({ user, action: "create", entity: "Student", entityId: String(student._id), after: student });
  return student;
}

export async function updateStudent(id: string | undefined, input: unknown, user?: AuthUser) {
  const recordId = requireId(id, "Student");
  const payload = requirePayload(input, "Student");
  const before = await Student.findById(recordId);
  if (!before) throw new ApiError(404, msg.notFound("Student"));
  before.set(payload);
  if (!before.isModified()) {
    throw new ApiError(400, msg.noChanges("Student"));
  }
  await before.save();
  await writeAudit({ user, action: "update", entity: "Student", entityId: recordId, before, after: before });
  return before;
}

export async function promoteStudents(
  ids: string[],
  targetClassId: string,
  targetSection: string,
  user?: AuthUser
) {
  if (!ids?.length) {
    throw new ApiError(400, msg.updateBlocked("Student", "No student ids were sent."));
  }
  const result = await Student.updateMany(
    { _id: { $in: ids } },
    { $set: { classId: targetClassId, section: targetSection } }
  );
  if (!result.matchedCount) {
    throw new ApiError(404, msg.notFound("Student"));
  }
  if (!result.modifiedCount) {
    throw new ApiError(400, msg.noChanges("Student"));
  }
  await writeAudit({
    user,
    action: "promote",
    entity: "Student",
    after: { ids, targetClassId, targetSection, matched: result.modifiedCount },
  });
  return result;
}
