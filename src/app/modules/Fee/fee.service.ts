import { FeeLedger, FeeStructure } from "../../../models/Fee";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId } from "../../../utils/persist";
import { ledgerStatus, aggregateFeesByClass } from "./fee.utils";
import type { PaymentInput } from "./fee.interface";

export { ledgerStatus };

export async function listStructures(academicYear?: string) {
  return FeeStructure.find(academicYear ? { academicYear } : {}).populate("classId", "name");
}

export async function createStructure(body: Record<string, unknown>) {
  return FeeStructure.create(body);
}

export async function listLedgers(query: Record<string, unknown>) {
  const filter: Record<string, unknown> = { deletedAt: null };
  if (query.studentId) filter.studentId = query.studentId;
  if (query.status) filter.status = query.status;
  return FeeLedger.find(filter)
    .populate({
      path: "studentId",
      select: "name studentId classId",
      populate: { path: "classId", select: "name" },
    })
    .sort({ createdAt: -1 });
}

export async function createLedger(body: {
  studentId: string;
  feeStructureId?: string;
  academicYear: string;
  title: string;
  dueAmount: number;
  discount?: number;
}) {
  const { Student } = await import("../../../models/Student");
  const student = await Student.findById(body.studentId).select("_id");
  if (!student) throw new ApiError(404, msg.notFound("Student"));
  if (body.feeStructureId) {
    const structure = await FeeStructure.findById(body.feeStructureId).select("_id");
    if (!structure) throw new ApiError(404, msg.notFound("Fee structure"));
  }
  const discount = Math.max(0, body.discount ?? 0);
  return FeeLedger.create({
    ...body,
    discount,
    paidAmount: 0,
    status: ledgerStatus(body.dueAmount, 0, discount),
  });
}

export async function addPayment(ledgerId: string | undefined, payment: PaymentInput, user?: AuthUser) {
  const id = requireId(ledgerId, "Fee ledger");
  const ledger = await FeeLedger.findById(id);
  if (!ledger || ledger.deletedAt) throw new ApiError(404, msg.notFound("Fee ledger"));
  const remaining = Math.max(ledger.dueAmount - (ledger.discount ?? 0) - ledger.paidAmount, 0);
  if (payment.amount > remaining) {
    throw new ApiError(400, `Payment exceeds remaining balance (৳ ${remaining}).`);
  }
  const paymentsSnapshot = ledger.payments.map((p) =>
    typeof (p as { toObject?: () => unknown }).toObject === "function"
      ? (p as { toObject: () => unknown }).toObject()
      : { ...p }
  );
  ledger.history.push({
    version: ledger.version,
    paidAmount: ledger.paidAmount,
    payments: paymentsSnapshot,
    at: new Date(),
  });
  ledger.payments.push({
    amount: payment.amount,
    method: payment.method,
    refNo: payment.refNo ?? "",
    note: payment.note ?? "",
    date: payment.date ? new Date(payment.date) : new Date(),
  });
  ledger.paidAmount += payment.amount;
  ledger.status = ledgerStatus(ledger.dueAmount, ledger.paidAmount, ledger.discount);
  ledger.version += 1;
  await ledger.save();
  await writeAudit({ user, action: "payment", entity: "FeeLedger", entityId: id, after: payment });
  return ledger;
}

export async function feeSummary() {
  const ledgers = await FeeLedger.find({ deletedAt: null }).populate({
    path: "studentId",
    select: "classId",
    populate: { path: "classId", select: "name" },
  });
  const due = ledgers.reduce((sum, item) => sum + Math.max(item.dueAmount - item.discount - item.paidAmount, 0), 0);
  const collected = ledgers.reduce((sum, item) => sum + item.paidAmount, 0);
  const byMethod: Record<string, number> = {};
  ledgers.forEach((ledger) => {
    ledger.payments.forEach((payment: { method: string; amount: number }) => {
      byMethod[payment.method] = (byMethod[payment.method] ?? 0) + payment.amount;
    });
  });
  return { due, collected, byMethod, count: ledgers.length, byClass: aggregateFeesByClass(ledgers) };
}

export async function archiveLedger(id: string | undefined) {
  const recordId = requireId(id, "Fee ledger");
  const ledger = await FeeLedger.findById(recordId);
  if (!ledger) throw new ApiError(404, msg.notFound("Fee ledger"));
  if (ledger.deletedAt) {
    throw new ApiError(400, msg.updateBlocked("Fee ledger", "It is already archived."));
  }
  ledger.deletedAt = new Date();
  await ledger.save();
  return { id: ledger._id };
}
