import { ExamType } from "../../../models/ExamType";
import { GradingRule } from "../../../models/GradingRule";
import { Result } from "../../../models/Result";
import { Student } from "../../../models/Student";
import { Subject } from "../../../models/Subject";
import {
  rankStudents,
  subjectResult,
  weightedFinal,
  type MeritRow,
  type TieBreakField,
} from "../../../lib/grading";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { resolveGradingRule, weightsSumTo100 } from "./exam.utils";
import type { MarkPayload } from "./exam.interface";

export async function listExams(academicYear?: string) {
  return ExamType.find(academicYear ? { academicYear } : {}).sort({ createdAt: -1 });
}

export async function createExam(body: Record<string, unknown>) {
  return ExamType.create(body);
}

export async function publishExam(id: string | undefined, isPublished: boolean) {
  const exam = await ExamType.findById(id);
  if (!exam) throw new ApiError(404, msg.notFound("Exam"));
  exam.isPublished = isPublished;
  await exam.save();
  return exam;
}

export async function listGradingRules(academicYear?: string) {
  return GradingRule.find(academicYear ? { academicYear } : {}).populate("weights.examTypeId", "name code");
}

export async function createGradingRule(body: {
  academicYear: string;
  weights: { examTypeId: string; weight: number }[];
  isDefault?: boolean;
  classId?: string;
} & Record<string, unknown>) {
  if (!weightsSumTo100(body.weights)) {
    throw new ApiError(400, msg.invalid("Grading formula", "Weights must add up to 100."));
  }
  if (body.isDefault && !body.classId) {
    await GradingRule.updateMany(
      { academicYear: body.academicYear, $or: [{ classId: { $exists: false } }, { classId: null }] },
      { isDefault: false }
    );
  }
  return GradingRule.create(body);
}

export async function listResults(filterInput: {
  examTypeId?: unknown;
  studentId?: unknown;
  classId?: unknown;
  section?: unknown;
  publishedOnly?: boolean;
}) {
  const filter: Record<string, unknown> = { deletedAt: null };
  if (filterInput.examTypeId) filter.examTypeId = filterInput.examTypeId;
  if (filterInput.studentId) filter.studentId = filterInput.studentId;
  if (filterInput.classId || filterInput.section) {
    const students = await Student.find({
      ...(filterInput.classId ? { classId: filterInput.classId } : {}),
      ...(filterInput.section ? { section: filterInput.section } : {}),
    }).select("_id");
    filter.studentId = { $in: students.map((item) => item._id) };
  }
  const items = await Result.find(filter)
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
      const exam = item.examTypeId as unknown as { isPublished?: boolean };
      return Boolean(exam?.isPublished);
    });
  }
  return items;
}

export async function upsertResult(
  input: { studentId: string; examTypeId: string; subjectMarks: MarkPayload[] },
  user?: AuthUser
) {
  const [student, exam, subjects] = await Promise.all([
    Student.findById(input.studentId),
    ExamType.findById(input.examTypeId),
    Subject.find({ _id: { $in: input.subjectMarks.map((item) => item.subjectId) } }),
  ]);
  if (!student || !exam) {
    throw new ApiError(404, msg.notFoundRead("Student or exam"));
  }

  const rule = await resolveGradingRule(exam.academicYear, student.classId ? String(student.classId) : undefined);
  const scale = rule?.scale ?? "gpa5";
  const subjectById = new Map(subjects.map((item) => [String(item._id), item]));
  const computed = input.subjectMarks.map((row) => {
    const subject = subjectById.get(row.subjectId);
    if (!subject) throw new ApiError(400, msg.invalid("Marks", "Unknown subject in marks."));
    const graded = subjectResult(row, subject.markDistribution, scale);
    return { ...row, ...graded, subjectId: row.subjectId };
  });

  const existing = await Result.findOne({ studentId: input.studentId, examTypeId: input.examTypeId, deletedAt: null });
  const bySubject = new Map<string, (typeof computed)[number]>();
  if (existing) {
    for (const row of existing.subjectMarks) {
      bySubject.set(String(row.subjectId), row as unknown as (typeof computed)[number]);
    }
  }
  for (const row of computed) {
    bySubject.set(String(row.subjectId), row);
  }
  const merged = Array.from(bySubject.values());

  const totalObtained = merged.reduce((sum, row) => sum + (row.obtained ?? 0), 0);
  const totalFull = merged.reduce((sum, row) => sum + (row.full ?? 0), 0);
  const gpa =
    merged.length === 0
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
    await writeAudit({ user, action: "update", entity: "Result", entityId: String(existing._id), after: payload });
    return { record: existing, created: false };
  }

  const created = await Result.create(payload);
  await writeAudit({ user, action: "create", entity: "Result", entityId: String(created._id), after: payload });
  return { record: created, created: true };
}

export async function recomputeMerit(examTypeId: string | undefined) {
  if (!examTypeId) throw new ApiError(400, msg.updateBlocked("Merit list", "Exam id is missing."));
  const exam = await ExamType.findById(examTypeId);
  if (!exam) throw new ApiError(404, msg.notFound("Merit list"));
  const rule = await GradingRule.findOne({ academicYear: exam.academicYear, isDefault: true });
  const tieBreak = (rule?.tieBreak ?? ["totalMarks", "gpa", "cq"]) as TieBreakField[];
  const rows = await Result.find({ examTypeId, deletedAt: null });
  if (!rows.length) {
    throw new ApiError(400, msg.updateBlocked("Merit list", "No saved marks were found for this exam."));
  }
  const meritRows: MeritRow[] = rows.map((row) => ({
    studentId: String(row.studentId),
    totalMarks: row.totalObtained,
    gpa: row.gpa,
    cq: row.subjectMarks.reduce((sum: number, item: { cq?: number }) => sum + (item.cq ?? 0), 0),
    attendance: row.subjectMarks.reduce((sum: number, item: { attendance?: number }) => sum + (item.attendance ?? 0), 0),
  }));
  const ranked = rankStudents(meritRows, tieBreak);
  await Promise.all(
    ranked.map((row, index) =>
      Result.updateOne({ studentId: row.studentId, examTypeId, deletedAt: null }, { meritPosition: index + 1 })
    )
  );
  return ranked.map((row, index) => ({ ...row, position: index + 1 }));
}

export async function finalGrade(studentId: string, academicYear: string) {
  const rule = await GradingRule.findOne({ academicYear, isDefault: true });
  if (!rule || !rule.weights.length) {
    throw new ApiError(400, msg.invalid("Final grade", "No default grading formula is saved for this year."));
  }
  const results = await Result.find({ studentId, academicYear, deletedAt: null });
  const parts = rule.weights.map((weight) => {
    const match = results.find((item) => String(item.examTypeId) === String(weight.examTypeId));
    return { score: match?.gpa ?? 0, weight: weight.weight };
  });
  return { finalGpa: weightedFinal(parts), parts };
}

export async function exportResults(examTypeId: string | undefined) {
  if (!examTypeId) throw new ApiError(400, msg.notFoundRead("Exam"));
  return Result.find({ examTypeId, deletedAt: null }).populate("studentId", "name studentId").sort({ meritPosition: 1 });
}
