import { SmsLog } from "../../../models/Notice";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
import { dispatchSms, smsNote } from "../../../lib/sms/dispatch";
import { normalizeBdPhone } from "../../../lib/sms/phone";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function listSms() {
  return SmsLog.find().sort({ createdAt: -1 }).limit(100);
}

export async function queueSms(input: {
  body: string;
  template?: string;
  audience: "all_guardians" | "class" | "teachers" | "custom";
  classId?: string;
  phones?: string[];
}) {
  let phones = input.phones ?? [];
  if (input.audience === "all_guardians") {
    const students = await Student.find({ status: "active" }).select("guardian.phone guardian.fatherPhone");
    phones = students
      .map((item) => normalizeBdPhone(item.guardian?.phone) ?? normalizeBdPhone(item.guardian?.fatherPhone) ?? "")
      .filter(Boolean);
  }
  if (input.audience === "class" && input.classId) {
    const students = await Student.find({ classId: input.classId, status: "active" }).select(
      "guardian.phone guardian.fatherPhone"
    );
    phones = students
      .map((item) => normalizeBdPhone(item.guardian?.phone) ?? normalizeBdPhone(item.guardian?.fatherPhone) ?? "")
      .filter(Boolean);
  }
  if (input.audience === "teachers") {
    const teachers = await Teacher.find({ isActive: true }).select("phone");
    phones = teachers.map((item) => normalizeBdPhone(item.phone) ?? "").filter(Boolean);
  }
  phones = [...new Set(phones)];
  if (!phones.length) {
    throw new ApiError(400, msg.invalid("SMS", "No phone numbers were found for this audience."));
  }

  const summary = await dispatchSms(
    phones.map((to) => ({
      to,
      body: input.body,
      template: input.template ?? "custom",
      audience: input.audience,
    }))
  );

  return { ...summary, queued: summary.sent + summary.failed };
}

export function smsQueueMessage(summary: { sent: number; failed: number; skipped: number }): string {
  const base = msg.saved("SMS");
  return `${base}${smsNote(summary)}`.trim();
}
