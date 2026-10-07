import mongoose from "mongoose";
import { SyllabusOutline } from "../../../models/Syllabus";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

function requireClassId(classId?: string): string {
  if (!classId || !mongoose.isValidObjectId(classId)) {
    throw new ApiError(400, msg.invalid("Syllabus", "Choose a class."));
  }
  return classId;
}

function chapterLines(values: string[]): string[] {
  return values.map((item) => item.trim()).filter(Boolean).slice(0, 12);
}

export async function listSyllabus(classId?: string) {
  const id = requireClassId(classId);
  return SyllabusOutline.find({ classId: id })
    .populate("subjectId", "name nameBn code")
    .sort({ academicYear: -1 })
    .lean();
}

export async function upsertSyllabus(body: {
  classId: string;
  subjectId: string;
  academicYear?: string;
  chaptersBn?: string[];
  chaptersEn?: string[];
}) {
  if (!mongoose.isValidObjectId(body.classId) || !mongoose.isValidObjectId(body.subjectId)) {
    throw new ApiError(400, msg.invalid("Syllabus", "Choose a class and a subject."));
  }
  const chaptersBn = chapterLines(body.chaptersBn ?? []);
  const chaptersEn = chapterLines(body.chaptersEn ?? []);
  if (!chaptersBn.length && !chaptersEn.length) {
    throw new ApiError(400, msg.invalid("Syllabus", "Add at least one chapter."));
  }
  return SyllabusOutline.findOneAndUpdate(
    { classId: body.classId, subjectId: body.subjectId, academicYear: (body.academicYear ?? "").trim() },
    { $set: { chaptersBn, chaptersEn } },
    { upsert: true, new: true }
  );
}

export async function publicSyllabus(classId?: string) {
  const rows = await listSyllabus(classId);
  const seen = new Set<string>();
  const outlines = [];
  for (const row of rows) {
    const subject = row.subjectId;
    const subjectId = subject && typeof subject === "object" && "_id" in subject ? String(subject._id) : String(subject);
    if (seen.has(subjectId)) continue;
    seen.add(subjectId);
    const named = subject && typeof subject === "object" ? subject : null;
    outlines.push({
      _id: row._id,
      subjectId,
      name: named && "name" in named ? String(named.name ?? "") : "",
      nameBn: named && "nameBn" in named ? String(named.nameBn ?? "") : "",
      academicYear: row.academicYear,
      chaptersBn: row.chaptersBn,
      chaptersEn: row.chaptersEn,
    });
  }
  return outlines;
}
