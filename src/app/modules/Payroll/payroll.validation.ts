import { z } from "zod";

export const payrollCreateValidation = z.object({
  teacherId: z.string(),
  month: z.string().min(1, "Payroll month is required"),
  advance: z.number().optional(),
  deduction: z.number().optional(),
});
