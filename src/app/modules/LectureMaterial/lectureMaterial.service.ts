import { LectureMaterial } from "../../../models/LectureMaterial";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function listLectureMaterials(filter: {
  classId?: string;
  subjectId?: string;
  teacherId?: string;
  academicYear?: string;
}) {
  const query: Record<string, unknown> = {};
  if (filter.classId) query.classId = filter.classId;
  if (filter.subjectId) query.subjectId = filter.subjectId;
  if (filter.teacherId) query.teacherId = filter.teacherId;
  if (filter.academicYear) query.academicYear = filter.academicYear;

  return LectureMaterial.find(query)
    .populate("classId", "name")
    .populate("subjectId", "name code")
    .populate("teacherId", "name")
    .sort({ createdAt: -1 });
}

export async function createLectureMaterial(body: Record<string, unknown>) {
  return LectureMaterial.create(body);
}

export async function updateLectureMaterial(id: string | undefined, body: Record<string, unknown>) {
  if (!id) throw new ApiError(400, msg.invalid("Material", "ID is required."));
  const material = await LectureMaterial.findById(id);
  if (!material) throw new ApiError(404, msg.notFound("Lecture material"));
  Object.assign(material, body);
  await material.save();
  return material;
}

export async function deleteLectureMaterial(id: string | undefined) {
  if (!id) throw new ApiError(400, msg.invalid("Material", "ID is required."));
  const material = await LectureMaterial.findByIdAndDelete(id);
  if (!material) throw new ApiError(404, msg.notFound("Lecture material"));
  return { deleted: true };
}

export async function listPublicLectureMaterials(classId?: string, subjectId?: string) {
  const query: Record<string, unknown> = { isVisible: true };
  if (classId) query.classId = classId;
  if (subjectId) query.subjectId = subjectId;

  return LectureMaterial.find(query)
    .populate("classId", "name")
    .populate("subjectId", "name code")
    .populate("teacherId", "name")
    .sort({ createdAt: -1 });
}
