import { Attendance } from "../../../models/Attendance";
import { Student } from "../../../models/Student";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { attendanceFilter } from "./attendance.utils";
import type { AttendanceEntry } from "./attendance.interface";

export async function listAttendance(query: Record<string, unknown>) {
  return Attendance.find(attendanceFilter(query)).populate("studentId", "name studentId");
}

export async function saveAttendanceBulk(input: {
  classId: string;
  section: string;
  date: string;
  entries: AttendanceEntry[];
  markedBy?: string;
}) {
  if (!input.entries?.length) {
    throw new ApiError(400, msg.noFields("Attendance"));
  }
  const ops = input.entries.map((entry) => ({
    updateOne: {
      filter: { studentId: entry.studentId, date: input.date },
      update: {
        $set: {
          classId: input.classId,
          section: input.section,
          date: input.date,
          status: entry.status,
          remark: entry.remark ?? "",
          markedBy: input.markedBy,
        },
      },
      upsert: true,
    },
  }));
  return Attendance.bulkWrite(ops as never);
}

export async function roster(classId?: string, section?: string) {
  return Student.find({ classId, section, status: "active" }).select("name studentId rollNo photoUrl").sort({ rollNo: 1, name: 1 });
}

export async function recordedDates(classId?: string, section?: string) {
  const filter: Record<string, unknown> = {};
  if (classId) filter.classId = classId;
  if (section) filter.section = section;
  return Attendance.distinct("date", filter);
}
