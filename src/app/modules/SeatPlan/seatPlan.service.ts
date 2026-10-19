import { SeatPlan } from "../../../models/SeatPlan";
import { Student } from "../../../models/Student";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function getSeatPlan(examId: string | undefined, classId?: string, section?: string) {
  if (!examId) throw new ApiError(400, msg.invalid("Seat Plan", "Exam ID is required."));
  const query: Record<string, unknown> = { examId };
  if (classId) query.classId = classId;
  if (section) query.section = section;
  return SeatPlan.findOne(query).populate("examId", "name code academicYear");
}

export async function generateSeatPlan(params: {
  examId: string;
  classId?: string;
  section?: string;
  halls: Array<{ name: string; rows: number; cols: number }>;
}) {
  if (!params.examId) throw new ApiError(400, msg.invalid("Seat Plan", "Exam ID is required."));
  if (!params.halls || params.halls.length === 0) {
    throw new ApiError(400, msg.invalid("Seat Plan", "At least one exam hall is required."));
  }

  // Fetch students for the class/section
  const studentQuery: Record<string, unknown> = { status: "active", deletedAt: null };
  if (params.classId) studentQuery.classId = params.classId;
  if (params.section) studentQuery.section = params.section;

  const students = await Student.find(studentQuery)
    .sort({ rollNo: 1, studentId: 1 })
    .select("_id name rollNo studentId");

  let studentIdx = 0;
  const builtHalls = [];

  for (const hall of params.halls) {
    const seats = [];
    let seatCounter = 1;
    for (let r = 1; r <= hall.rows; r++) {
      for (let c = 1; c <= hall.cols; c++) {
        const student = studentIdx < students.length ? students[studentIdx] : undefined;
        seats.push({
          seatNo: `H-${hall.name.charAt(0).toUpperCase()}${seatCounter}`,
          row: r,
          col: c,
          studentId: student?._id,
          studentName: student?.name ?? "",
          studentSysId: student?.studentId ?? "",
          rollNo: student?.rollNo ?? "",
        });
        seatCounter++;
        if (student) studentIdx++;
      }
    }
    builtHalls.push({
      name: hall.name,
      rows: hall.rows,
      cols: hall.cols,
      seats,
    });
  }

  const updated = await SeatPlan.findOneAndUpdate(
    {
      examId: params.examId,
      ...(params.classId ? { classId: params.classId } : {}),
      ...(params.section ? { section: params.section } : {}),
    },
    {
      examId: params.examId,
      classId: params.classId,
      section: params.section,
      halls: builtHalls,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return updated;
}

export async function saveSeatPlan(id: string | undefined, body: Record<string, unknown>) {
  if (!id) throw new ApiError(400, msg.invalid("Seat Plan", "ID is required."));
  const plan = await SeatPlan.findById(id);
  if (!plan) throw new ApiError(404, msg.notFound("Seat Plan"));
  Object.assign(plan, body);
  await plan.save();
  return plan;
}

export async function deleteSeatPlan(id: string | undefined) {
  if (!id) throw new ApiError(400, msg.invalid("Seat Plan", "ID is required."));
  const plan = await SeatPlan.findByIdAndDelete(id);
  if (!plan) throw new ApiError(404, msg.notFound("Seat Plan"));
  return { deleted: true };
}
