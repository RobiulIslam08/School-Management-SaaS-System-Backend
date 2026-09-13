import { ClassStructure } from "../../../models/ClassStructure";
import { Student } from "../../../models/Student";
import { Subject } from "../../../models/Subject";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId, updateDocument } from "../../../utils/persist";
import { asSections } from "./class.utils";
import type { ClassCreateBody, ClassSectionBody } from "./class.interface";

export async function listClasses() {
  const items = await ClassStructure.find().sort({ sortOrder: 1, level: 1, name: 1 });
  return items.map((item) => {
    const json = item.toObject();
    return { ...json, sections: asSections(json.sections) };
  });
}

export async function createClass(body: ClassCreateBody) {
  return ClassStructure.create({
    ...body,
    sortOrder: body.sortOrder ?? body.level,
    sections: asSections(body.sections),
  });
}

export async function updateClass(id: string | undefined, body: unknown) {
  const payload = body && typeof body === "object" ? { ...(body as Record<string, unknown>) } : body;
  if (payload && typeof payload === "object" && "sections" in payload) {
    (payload as { sections: unknown }).sections = asSections((payload as { sections: unknown }).sections);
  }
  return updateDocument(ClassStructure, id, payload, "Class");
}

export async function archiveClass(id: string | undefined) {
  const recordId = requireId(id, "Class");
  const enrolled = await Student.countDocuments({ classId: recordId, status: "active" });
  const item = await ClassStructure.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFound("Class"));
  item.isActive = false;
  await item.save();
  return { ...item.toObject(), enrolled };
}

export async function deleteClass(id: string | undefined) {
  const recordId = requireId(id, "Class");
  const enrolled = await Student.countDocuments({ classId: recordId, status: "active" });
  if (enrolled > 0) {
    throw new ApiError(409, msg.invalid("Class", "Active students are still enrolled in this class."));
  }
  const item = await ClassStructure.findByIdAndDelete(recordId);
  if (!item) throw new ApiError(404, msg.notFound("Class"));
  return { deleted: true };
}

export async function upsertSection(id: string | undefined, body: ClassSectionBody, previousName?: string) {
  const recordId = requireId(id, "Class");
  const item = await ClassStructure.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFoundRead("Class"));
  const sections = asSections(item.sections);
  const key = previousName ?? body.name;
  const index = sections.findIndex((row) => row.name === key);
  const next = {
    name: body.name,
    capacity: body.capacity ?? 0,
    classTeacherId: body.classTeacherId as never,
  };
  if (index >= 0) sections[index] = next;
  else sections.push(next);
  item.sections = sections;
  await item.save();
  return item;
}

export async function removeSection(id: string | undefined, name: string) {
  const recordId = requireId(id, "Class");
  const enrolled = await Student.countDocuments({ classId: recordId, section: name, status: "active" });
  if (enrolled > 0) {
    throw new ApiError(409, msg.invalid("Section", "Active students are still in this section."));
  }
  const item = await ClassStructure.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFoundRead("Class"));
  item.sections = asSections(item.sections).filter((row) => row.name !== name);
  await item.save();
  return item;
}

export async function classWorkspace(id: string | undefined) {
  const recordId = requireId(id, "Class");
  const item = await ClassStructure.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFoundRead("Class"));
  const sections = asSections(item.sections);
  const [students, subjects] = await Promise.all([
    Student.countDocuments({ classId: recordId, status: "active" }),
    Subject.countDocuments({ classId: recordId, isActive: true }),
  ]);
  const bySection = await Student.aggregate([
    { $match: { classId: item._id, status: "active" } },
    { $group: { _id: "$section", count: { $sum: 1 } } },
  ]);
  return {
    class: { ...item.toObject(), sections },
    counts: {
      students,
      subjects,
      sections: sections.length,
      bySection: Object.fromEntries(bySection.map((row) => [row._id, row.count])),
    },
  };
}
