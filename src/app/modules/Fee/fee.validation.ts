import { z } from "zod";
import { PAYMENT_METHODS } from "../../../models/Fee";

export const feeStructureValidation = z.object({
  name: z.string().min(1, "Fee name is required"),
  classId: z.string().optional(),
  academicYear: z.string(),
  amount: z.number().positive(),
  type: z.enum(["monthly", "one_time"]),
  month: z.string().optional(),
});

export const feeLedgerValidation = z.object({
  studentId: z.string(),
  feeStructureId: z.string().optional(),
  academicYear: z.string(),
  title: z.string(),
  dueAmount: z.number().positive(),
  discount: z.number().nonnegative().optional(),
});

export const paymentValidation = z.object({
  amount: z.number().positive(),
  method: z.enum(PAYMENT_METHODS),
  refNo: z.string().optional(),
  note: z.string().optional(),
  date: z.string().optional(),
});

const batchPaymentLine = z
  .object({
    ledgerId: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    amount: z.number().positive(),
  })
  .refine((line) => Boolean(line.ledgerId || line.title), {
    message: "Each line needs a ledger or a fee title",
  });

export const batchPaymentValidation = z
  .object({
    studentId: z.string().min(1).optional(),
    method: z.enum(PAYMENT_METHODS),
    refNo: z.string().optional(),
    note: z.string().optional(),
    date: z.string().optional(),
    lines: z.array(batchPaymentLine).min(1, "At least one fee line is required"),
  })
  .refine((body) => body.lines.every((line) => line.ledgerId || (body.studentId && line.title)), {
    message: "Student is required when a fee title has no ledger",
  });
