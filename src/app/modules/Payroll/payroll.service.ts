import { Payroll } from "../../../models/Operations";
import { Teacher } from "../../../models/Teacher";
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

export async function markPaid(id: string | undefined) {
  const recordId = requireId(id, "Payslip");
  const item = await Payroll.findById(recordId);
  if (!item) throw new ApiError(404, msg.notFound("Payslip"));
  if (item.status === "paid") {
    throw new ApiError(400, msg.noChanges("Payslip"));
  }
  item.status = "paid";
  item.paidAt = new Date();
  await item.save();
  return item;
}
