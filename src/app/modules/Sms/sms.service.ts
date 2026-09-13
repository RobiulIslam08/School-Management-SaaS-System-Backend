import { SmsLog } from "../../../models/Notice";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
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
    const students = await Student.find({ status: "active" }).select("guardian.phone");
    phones = students.map((item) => item.guardian.phone).filter(Boolean);
  }
  if (input.audience === "class" && input.classId) {
    const students = await Student.find({ classId: input.classId, status: "active" }).select("guardian.phone");
    phones = students.map((item) => item.guardian.phone).filter(Boolean);
  }
  if (input.audience === "teachers") {
    const teachers = await Teacher.find({ isActive: true }).select("phone");
    phones = teachers.map((item) => item.phone).filter(Boolean);
  }
  if (!phones.length) {
    throw new ApiError(400, msg.invalid("SMS", "No phone numbers were found for this audience."));
  }
  const logs = await SmsLog.insertMany(
    phones.map((to: string) => ({
      to,
      body: input.body,
      template: input.template ?? "custom",
      status: "queued",
      audience: input.audience,
    }))
  );
  return { queued: logs.length };
}
