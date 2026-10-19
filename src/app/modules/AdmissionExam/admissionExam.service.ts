import { AdmissionExam } from "../../../models/AdmissionExam";
import { AdmissionExamResult } from "../../../models/AdmissionExamResult";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function listAdmissionExams(academicYear?: string) {
  const query = academicYear ? { academicYear } : {};
  return AdmissionExam.find(query).sort({ createdAt: -1 });
}

export async function createAdmissionExam(body: Record<string, unknown>) {
  return AdmissionExam.create(body);
}

export async function updateAdmissionExam(id: string | undefined, body: Record<string, unknown>) {
  if (!id) throw new ApiError(400, msg.invalid("Admission Exam", "ID is required."));
  const exam = await AdmissionExam.findById(id);
  if (!exam) throw new ApiError(404, msg.notFound("Admission Exam"));
  Object.assign(exam, body);
  await exam.save();
  return exam;
}

export async function deleteAdmissionExam(id: string | undefined) {
  if (!id) throw new ApiError(400, msg.invalid("Admission Exam", "ID is required."));
  const exam = await AdmissionExam.findByIdAndDelete(id);
  if (!exam) throw new ApiError(404, msg.notFound("Admission Exam"));
  await AdmissionExamResult.deleteMany({ examId: id });
  return { deleted: true };
}

export async function publishAdmissionExam(id: string | undefined, isPublished: boolean) {
  if (!id) throw new ApiError(400, msg.invalid("Admission Exam", "ID is required."));
  const exam = await AdmissionExam.findById(id);
  if (!exam) throw new ApiError(404, msg.notFound("Admission Exam"));
  exam.isPublished = isPublished;
  await exam.save();
  return exam;
}

export async function listAdmissionResults(examId: string | undefined) {
  if (!examId) throw new ApiError(400, msg.invalid("Admission Results", "Exam ID is required."));
  return AdmissionExamResult.find({ examId }).sort({ marks: -1, roll: 1 });
}

export async function upsertAdmissionResult(
  examId: string | undefined,
  body: {
    roll: string;
    applicantName: string;
    applicantNameBn?: string;
    phone?: string;
    marks: number;
    status?: "pass" | "fail" | "pending";
    notes?: string;
  }
) {
  if (!examId) throw new ApiError(400, msg.invalid("Admission Result", "Exam ID is required."));
  const exam = await AdmissionExam.findById(examId);
  if (!exam) throw new ApiError(404, msg.notFound("Admission Exam"));

  const autoStatus = body.status ?? (body.marks >= exam.passMark ? "pass" : "fail");
  const updated = await AdmissionExamResult.findOneAndUpdate(
    { examId, roll: body.roll.trim() },
    {
      ...body,
      roll: body.roll.trim(),
      status: autoStatus,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return updated;
}

export async function bulkSaveAdmissionResults(
  examId: string | undefined,
  items: Array<{
    roll: string;
    applicantName: string;
    applicantNameBn?: string;
    phone?: string;
    marks: number;
    status?: "pass" | "fail" | "pending";
  }>
) {
  if (!examId) throw new ApiError(400, msg.invalid("Admission Result", "Exam ID is required."));
  const exam = await AdmissionExam.findById(examId);
  if (!exam) throw new ApiError(404, msg.notFound("Admission Exam"));

  const results = [];
  for (const item of items) {
    if (!item.roll || !item.applicantName) continue;
    const status = item.status ?? (item.marks >= exam.passMark ? "pass" : "fail");
    const doc = await AdmissionExamResult.findOneAndUpdate(
      { examId, roll: item.roll.trim() },
      { ...item, roll: item.roll.trim(), status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    results.push(doc);
  }
  return results;
}

export async function searchPublicAdmissionResult(params: {
  examId?: string;
  roll?: string;
  phone?: string;
}) {
  if (!params.roll && !params.phone) {
    throw new ApiError(400, msg.invalid("Search", "Roll number or phone number is required."));
  }

  // Find all published admission exams
  const publishedExams = await AdmissionExam.find({ isPublished: true }).select("_id name academicYear totalMark passMark className");
  const publishedIds = publishedExams.map((e) => e._id);

  const query: Record<string, unknown> = {
    examId: params.examId ? params.examId : { $in: publishedIds },
  };

  if (params.roll) {
    query.roll = params.roll.trim();
  }
  if (params.phone) {
    query.phone = params.phone.trim();
  }

  const results = await AdmissionExamResult.find(query)
    .populate("examId", "name academicYear totalMark passMark className isPublished")
    .sort({ createdAt: -1 });

  // Filter only those whose exam is published
  return results.filter((r) => {
    const ex = r.examId as unknown as { isPublished?: boolean };
    return ex && ex.isPublished;
  });
}
