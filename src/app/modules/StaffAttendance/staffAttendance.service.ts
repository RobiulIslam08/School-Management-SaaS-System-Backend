import { StaffAttendance } from "../../../models/Accounts";
import { Teacher } from "../../../models/Teacher";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function listStaffAttendance(query: { date?: string; from?: string; to?: string } = {}) {
  const date = query.date;
  const from = query.from;
  const to = query.to;
  if (from || to) {
    if (!from || !to || !DATE_RE.test(from) || !DATE_RE.test(to) || from > to) {
      throw new ApiError(400, "A valid date range (from and to, YYYY-MM-DD) is required");
    }
    return StaffAttendance.find({ date: { $gte: from, $lte: to } })
      .populate("teacherId", "name staffId designation photoUrl")
      .sort({ date: 1 });
  }
  if (!date || !DATE_RE.test(date)) {
    throw new ApiError(400, "A valid date (YYYY-MM-DD) is required");
  }
  return StaffAttendance.find({ date })
    .populate("teacherId", "name staffId designation photoUrl")
    .sort({ date: -1 });
}

export async function staffRoster() {
  return Teacher.find({ isActive: true })
    .select("name staffId designation photoUrl")
    .sort({ name: 1 });
}

export async function staffRecordedDates() {
  return StaffAttendance.distinct("date");
}

export async function saveStaffAttendanceBulk(input: {
  date: string;
  entries: Array<{ teacherId: string; status: string; remark?: string }>;
  markedBy?: string;
}) {
  if (!DATE_RE.test(input.date)) {
    throw new ApiError(400, "A valid date (YYYY-MM-DD) is required");
  }
  if (!input.entries?.length) {
    throw new ApiError(400, msg.noFields("Staff attendance"));
  }

  const ids = [...new Set(input.entries.map((e) => e.teacherId))];
  const teachers = await Teacher.find({ _id: { $in: ids }, isActive: true }).select("_id");
  if (teachers.length !== ids.length) {
    throw new ApiError(400, "One or more staff members are missing or inactive");
  }

  const ops = input.entries.map((entry) => ({
    updateOne: {
      filter: { teacherId: entry.teacherId, date: input.date },
      update: {
        $set: {
          teacherId: entry.teacherId,
          date: input.date,
          status: entry.status,
          remark: entry.remark ?? "",
          markedBy: input.markedBy,
        },
      },
      upsert: true,
    },
  }));
  await StaffAttendance.bulkWrite(ops as never);
  return listStaffAttendance({ date: input.date });
}
