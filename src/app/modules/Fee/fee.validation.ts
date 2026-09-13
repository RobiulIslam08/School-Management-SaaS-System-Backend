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
  discount: z.number().optional(),
});

export const paymentValidation = z.object({
  amount: z.number().positive(),
  method: z.enum(PAYMENT_METHODS),
  refNo: z.string().optional(),
  note: z.string().optional(),
  date: z.string().optional(),
});
