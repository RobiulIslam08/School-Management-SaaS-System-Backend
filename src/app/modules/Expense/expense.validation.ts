import { z } from "zod";
import { EXPENSE_CATEGORIES } from "../../../models/Accounts";
import { PAYMENT_METHODS } from "../../../models/Fee";

export const expenseCreateValidation = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  title: z.string().min(1, "Title is required").max(200),
  note: z.string().max(2000).optional(),
  paidVia: z.enum(PAYMENT_METHODS).optional(),
  paidByName: z.string().max(120).optional(),
  vendor: z.string().max(120).optional(),
  refNo: z.string().max(80).optional(),
  academicYear: z.string().max(20).optional(),
});

export const expenseUpdateValidation = expenseCreateValidation.partial();
