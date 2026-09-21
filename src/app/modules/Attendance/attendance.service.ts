import { Attendance } from "../../../models/Attendance";
import { ClassStructure } from "../../../models/ClassStructure";
import { Student } from "../../../models/Student";
import {
  dispatchSms,
  emptySmsSummary,
  getSmsSchoolName,
  isSmsTriggerEnabled,
  smsNote,
  type SmsSendSummary,
} from "../../../lib/sms/dispatch";
import { fatherNotifyPhone } from "../../../lib/sms/phone";
import { attendanceAbsentSms } from "../../../lib/sms/templates";
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
}): Promise<{ upserted: number; modified: number; sms: SmsSendSummary }> {
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
  const result = await Attendance.bulkWrite(ops as never);
  const sms = await sendAbsentSms(input);
  return {
    upserted: result.upsertedCount ?? 0,
    modified: result.modifiedCount ?? 0,
    sms,
  };
}

async function sendAbsentSms(input: {
  classId: string;
  date: string;
  entries: AttendanceEntry[];
}): Promise<SmsSendSummary> {
  const absentIds = input.entries.filter((e) => e.status === "absent").map((e) => e.studentId);
  if (!absentIds.length) return emptySmsSummary();
  if (!(await isSmsTriggerEnabled("attendance"))) return emptySmsSummary();

  const [students, klass, schoolName] = await Promise.all([
    Student.find({ _id: { $in: absentIds } }).select("name nameBn guardian"),
    ClassStructure.findById(input.classId).select("name").lean(),
    getSmsSchoolName(),
  ]);

  const items = students
    .map((student) => {
      const to = fatherNotifyPhone(student.guardian);
      if (!to) return null;
      return {
        to,
        body: attendanceAbsentSms({
          schoolName,
          studentName: student.nameBn || student.name,
          date: input.date,
          className: klass?.name,
        }),
        template: "attendance_absent",
        audience: "guardian",
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const skipped = absentIds.length - items.length;
  const summary = await dispatchSms(items);
  summary.skipped += skipped;
  return summary;
}

export function attendanceSaveMessage(sms: SmsSendSummary): string {
  return `${msg.saved("Attendance")}${smsNote(sms)}`.trim();
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
