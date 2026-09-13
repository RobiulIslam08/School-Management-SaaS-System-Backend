import { Teacher } from "../../../models/Teacher";
import { updateDocument } from "../../../utils/persist";
import { nextStaffId } from "./teacher.utils";

export async function listTeachers(q?: string) {
  const filter = q
    ? { $or: [{ name: new RegExp(q, "i") }, { staffId: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }] }
    : {};
  return Teacher.find(filter).populate("subjects", "name code").sort({ name: 1 });
}

export async function createTeacher(body: Record<string, unknown>) {
  const count = await Teacher.countDocuments();
  const staffId = String(body.staffId || (await nextStaffId(count)));
  return Teacher.create({ ...body, staffId });
}

export async function updateTeacher(id: string | undefined, body: unknown) {
  return updateDocument(Teacher, id, body, "Teacher");
}
