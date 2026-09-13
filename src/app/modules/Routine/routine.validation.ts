import { z } from "zod";

export const routineSlotValidation = z.object({
  classId: z.string().min(1),
  section: z.string().min(1),
  day: z.number().int().min(0).max(6),
  period: z.number().int().min(1).max(12),
  subjectId: z.string().optional(),
  teacherId: z.string().optional(),
});
