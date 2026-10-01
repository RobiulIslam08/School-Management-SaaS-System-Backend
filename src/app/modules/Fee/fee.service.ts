import { FeeLedger, FeeStructure } from "../../../models/Fee";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId } from "../../../utils/persist";
import { ledgerStatus, aggregateFeesByClass } from "./fee.utils";
import type { BatchPaymentInput, BatchPaymentLine, BatchPaymentResult, PaymentInput } from "./fee.interface";

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
    receiptNo: payment.receiptNo ?? "",
    note: payment.note ?? "",
    particular: payment.particular ?? "",
    date: payment.date ? new Date(payment.date) : new Date(),
  });
  ledger.paidAmount += payment.amount;
  ledger.status = ledgerStatus(ledger.dueAmount, ledger.paidAmount, ledger.discount);
  ledger.version += 1;
  await ledger.save();
  await writeAudit({ user, action: "payment", entity: "FeeLedger", entityId: id, after: payment });
  return ledger;
}

function receiptStamp(date?: string): { receiptNo: string; iso: string } {
  const paidAt = date ? new Date(date) : new Date();
  const ymd =
    date && /^\d{4}-\d{2}-\d{2}/.test(date)
      ? date.slice(0, 10).replace(/-/g, "")
      : `${paidAt.getFullYear()}${String(paidAt.getMonth() + 1).padStart(2, "0")}${String(paidAt.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return { receiptNo: `FEE-${ymd}-${suffix}`, iso: paidAt.toISOString() };
}

function classLabel(value: unknown): string {
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;
    return typeof name === "string" ? name : "";
  }
  return "";
}

function remainingOf(ledger: { dueAmount: number; discount?: number; paidAmount: number }): number {
  return Math.max(ledger.dueAmount - (ledger.discount ?? 0) - ledger.paidAmount, 0);
}

function headName(title: string): string {
  const trimmed = title.trim();
  const match = trimmed.match(/^(.*)\s+\([^)]*\)$/);
  return (match?.[1] ?? trimmed).trim();
}

function titleMatchesHead(title: string, head: string): boolean {
  const value = title.trim();
  return value === head || value.startsWith(`${head} (`) || value.startsWith(`${head}(`);
}

type LedgerDoc = InstanceType<typeof FeeLedger>;

type PlannedLine = {
  ledger: LedgerDoc | null;
  createFor?: { studentId: string; academicYear: string; title: string };
  title: string;
  amount: number;
};

function pickOpenLedger(candidates: LedgerDoc[], printed: string, head: string, amount: number): LedgerDoc | null {
  const fits = (ledger: LedgerDoc) => remainingOf(ledger) >= amount;
  const exact = candidates.find((ledger) => ledger.title.trim() === printed && fits(ledger));
  if (exact) return exact;
  const bare = candidates.find((ledger) => ledger.title.trim() === head && fits(ledger));
  if (bare) return bare;
  return candidates.filter(fits).sort((a, b) => remainingOf(b) - remainingOf(a))[0] ?? null;
}

async function planPaymentLine(line: BatchPaymentLine, studentId: string | undefined): Promise<PlannedLine> {
  const printed = (line.title ?? "").trim();
  if (line.ledgerId) {
    const ledger = await FeeLedger.findOne({ _id: line.ledgerId, deletedAt: null });
    if (!ledger) throw new ApiError(404, msg.notFound("Fee ledger"));
    const remaining = remainingOf(ledger);
    if (line.amount > remaining) {
      throw new ApiError(400, `Payment exceeds remaining balance for ${ledger.title} (৳ ${remaining}).`);
    }
    return { ledger, title: printed || ledger.title, amount: line.amount };
  }

  if (!studentId || !printed) {
    throw new ApiError(400, "Student is required when a fee title has no ledger");
  }
  const head = headName(printed);
  const open = await FeeLedger.find({
    studentId,
    deletedAt: null,
    status: { $in: ["due", "partial"] },
  });
  const candidates = open.filter((ledger) => remainingOf(ledger) > 0 && titleMatchesHead(ledger.title, head));
  const chosen = pickOpenLedger(candidates, printed, head, line.amount);
  if (chosen) return { ledger: chosen, title: printed, amount: line.amount };
  if (candidates.length) {
    const largest = Math.max(...candidates.map((ledger) => remainingOf(ledger)));
    const named = candidates.find((ledger) => remainingOf(ledger) === largest) ?? candidates[0];
    throw new ApiError(400, `Payment exceeds remaining balance for ${named.title} (৳ ${largest}).`);
  }

  const { Student } = await import("../../../models/Student");
  const student = await Student.findById(studentId).select("academicYear");
  if (!student) throw new ApiError(404, msg.notFound("Student"));
  return {
    ledger: null,
    createFor: {
      studentId,
      academicYear: student.academicYear || String(new Date().getFullYear()),
      title: printed,
    },
    title: printed,
    amount: line.amount,
  };
}

export async function addPayments(input: BatchPaymentInput, user?: AuthUser): Promise<BatchPaymentResult> {
  const lines = input.lines ?? [];
  if (!lines.length) throw new ApiError(400, "At least one fee line is required");

  const planned: PlannedLine[] = [];
  for (const line of lines) {
    planned.push(await planPaymentLine(line, input.studentId));
  }

  const knownIds = planned.flatMap((item) => (item.ledger ? [String(item.ledger._id)] : []));
  if (new Set(knownIds).size !== knownIds.length) {
    throw new ApiError(400, "Each fee head can be paid only once in a receipt");
  }

  const studentIds = new Set<string>();
  if (input.studentId) studentIds.add(input.studentId);
  for (const item of planned) {
    if (item.ledger) studentIds.add(String(item.ledger.studentId));
  }
  if (studentIds.size !== 1) {
    throw new ApiError(400, "All fee lines must belong to the same student");
  }

  const resolved = [];
  for (const item of planned) {
    const ledger =
      item.ledger ??
      (await FeeLedger.create({
        studentId: item.createFor!.studentId,
        academicYear: item.createFor!.academicYear,
        title: item.createFor!.title,
        dueAmount: item.amount,
        discount: 0,
        paidAmount: 0,
        status: "due",
      }));
    resolved.push({ ledger, title: item.title, amount: item.amount });
  }

  const stamp = receiptStamp(input.date);
  for (const item of resolved) {
    await addPayment(
      String(item.ledger._id),
      {
        amount: item.amount,
        method: input.method,
        refNo: input.refNo,
        note: input.note,
        date: input.date,
        receiptNo: stamp.receiptNo,
        particular: item.title,
      },
      user
    );
  }

  const { Student } = await import("../../../models/Student");
  const student = await Student.findById([...studentIds][0])
    .select("name studentId classId")
    .populate("classId", "name");
  const years = [...new Set(resolved.map((item) => item.ledger.academicYear).filter(Boolean))];

  return {
    receiptNo: stamp.receiptNo,
    method: input.method,
    refNo: input.refNo ?? "",
    date: stamp.iso,
    academicYear: years.join(", "),
    student: {
      name: student?.name ?? "",
      studentId: student?.studentId ?? "",
      className: classLabel(student?.classId),
    },
    lines: resolved.map((item) => ({
      ledgerId: String(item.ledger._id),
      title: item.title,
      amount: item.amount,
    })),
  };
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
