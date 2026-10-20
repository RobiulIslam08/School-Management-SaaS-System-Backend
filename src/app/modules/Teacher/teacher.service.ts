import { Teacher } from "../../../models/Teacher";
import { updateDocument } from "../../../utils/persist";
import { invalidatePublicSiteCache } from "../Website/website.service";
import { nextStaffId } from "./teacher.utils";

export async function listTeachers(q?: string) {
  const filter = q
    ? { $or: [{ name: new RegExp(q, "i") }, { staffId: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }] }
    : {};
  return Teacher.find(filter).populate("subjects", "name nameBn code").sort({ name: 1 });
}

export async function createTeacher(body: Record<string, unknown>) {
  const count = await Teacher.countDocuments();
  const staffId = String(body.staffId || (await nextStaffId(count)));
  const teacher = await Teacher.create({ ...body, staffId });
  invalidatePublicSiteCache();
  return teacher;
}

export async function updateTeacher(id: string | undefined, body: unknown) {
  const result = await updateDocument(Teacher, id, body, "Teacher");
  invalidatePublicSiteCache();
  return result;
}
