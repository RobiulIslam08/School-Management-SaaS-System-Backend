import { z } from "zod";

export const teacherCreateValidation = z.object({
  staffId: z.string().optional(),
  name: z.string().min(2, "Teacher name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  designation: z.string().optional(),
  photoUrl: z.string().optional(),
  joiningDate: z.string().optional(),
  retirementDate: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  salaryStructure: z
    .object({
      basic: z.number().optional(),
      house: z.number().optional(),
      medical: z.number().optional(),
      other: z.number().optional(),
    })
    .optional(),
});

export const teacherUpdateValidation = teacherCreateValidation.partial();
