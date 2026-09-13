import { z } from "zod";

export const teacherCreateValidation = z.object({
  staffId: z.string().optional(),
  name: z.string().min(2, "Teacher name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  designation: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  salaryStructure: z
    .object({
      basic: z.number(),
      house: z.number(),
      medical: z.number(),
      other: z.number(),
    })
    .optional(),
});

export const teacherUpdateValidation = teacherCreateValidation.partial();
