import { Subject } from "../../../models/Subject";
import { Teacher } from "../../../models/Teacher";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId, updateDocument } from "../../../utils/persist";
import type { SubjectCreateBody } from "./subject.interface";
import { nextSortOrder } from "./subject.utils";

export async function listSubjects(classId?: string) {
  return Subject.find(classId ? { classId } : {})
    .populate("classId", "name code")
    .populate("teacherId", "name staffId photoUrl")
    .sort({ sortOrder: 1, name: 1 });
}

export async function createSubject(body: SubjectCreateBody) {
  const max = await Subject.findOne({ classId: body.classId }).sort({ sortOrder: -1 }).select("sortOrder");
  return Subject.create({
    ...body,
    sortOrder: body.sortOrder ?? nextSortOrder(max?.sortOrder),
    compulsory: body.compulsory ?? true,
  });
}

export async function updateSubject(id: string | undefined, body: unknown) {
  return updateDocument(Subject, id, body, "Subject");
}

export async function deleteSubject(id: string | undefined) {
  const recordId = requireId(id, "Subject");
  const item = await Subject.findByIdAndDelete(recordId);
  if (!item) throw new ApiError(404, msg.notFound("Subject"));
  return { deleted: true };
}

export async function reorderSubjects(classId: string, orderedIds: string[]) {
  await Promise.all(orderedIds.map((id, index) => Subject.updateOne({ _id: id, classId }, { sortOrder: index })));
  return listSubjects(classId);
}

export async function assignTeacher(id: string | undefined, teacherId?: string) {
  const recordId = requireId(id, "Subject");
  const subject = await Subject.findById(recordId);
  if (!subject) throw new ApiError(404, msg.notFound("Subject"));
  const previous = subject.teacherId ? String(subject.teacherId) : undefined;
  subject.teacherId = teacherId ? (teacherId as never) : undefined;
  await subject.save();
  if (previous) {
    await Teacher.updateOne({ _id: previous }, { $pull: { subjects: subject._id } });
  }
  if (teacherId) {
    await Teacher.updateOne({ _id: teacherId }, { $addToSet: { subjects: subject._id } });
  }
  return subject.populate("teacherId", "name staffId");
}
