import { Payroll } from "../../../models/Operations";
import { Teacher } from "../../../models/Teacher";
import {
  dispatchSms,
  emptySmsSummary,
  getSmsSchoolName,
  isSmsTriggerEnabled,
  smsNote,
  type SmsSendSummary,
} from "../../../lib/sms/dispatch";
import { normalizeBdPhone } from "../../../lib/sms/phone";
import { payrollPaidSms } from "../../../lib/sms/templates";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId } from "../../../utils/persist";
import { computeNet } from "./payroll.utils";

export async function listPayroll() {
  return Payroll.find({ deletedAt: null }).populate("teacherId", "name staffId photoUrl");
}

export async function createPayroll(input: { teacherId: string; month: string; advance?: number; deduction?: number }) {
  const teacher = await Teacher.findById(input.teacherId);
  if (!teacher) throw new ApiError(404, msg.notFoundRead("Teacher"));
  const basic = teacher.salaryStructure.basic;
  const allowances = teacher.salaryStructure.house + teacher.salaryStructure.medical + teacher.salaryStructure.other;
  const advance = input.advance ?? 0;
  const deduction = input.deduction ?? 0;
  return Payroll.create({
    teacherId: teacher._id,
    month: input.month,
    basic,
    allowances,
    advance,
    deduction,
    net: computeNet(basic, allowances, advance, deduction),
  });
}

export async function markPaid(id: string | undefined): Promise<{ item: InstanceType<typeof Payroll>; sms: SmsSendSummary }> {
  const recordId = requireId(id, "Payslip");
  const item = await Payroll.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFound("Payslip"));
  if (item.status === "paid") {
    throw new ApiError(400, msg.noChanges("Payslip"));
  }
  item.status = "paid";
  item.paidAt = new Date();
  await item.save();
  const sms = await sendPayrollSms(item);
  return { item, sms };
}

async function sendPayrollSms(item: InstanceType<typeof Payroll>): Promise<SmsSendSummary> {
  if (!(await isSmsTriggerEnabled("payroll"))) return emptySmsSummary();
  const teacher = await Teacher.findById(item.teacherId).select("name phone");
  if (!teacher) return emptySmsSummary();
  const to = normalizeBdPhone(teacher.phone);
  if (!to) return { sent: 0, failed: 0, skipped: 1 };

  const schoolName = await getSmsSchoolName();
  return dispatchSms([
    {
      to,
      body: payrollPaidSms({
        schoolName,
        teacherName: teacher.name,
        month: item.month,
        net: item.net,
      }),
      template: "payroll_paid",
      audience: "teachers",
    },
  ]);
}

export function payrollPayMessage(sms: SmsSendSummary): string {
  return `${msg.updated("Payslip")}${smsNote(sms)}`.trim();
}
