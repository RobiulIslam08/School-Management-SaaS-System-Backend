import { z } from "zod";

export const classCreateValidation = z.object({
  name: z.string().min(1, "Class name is required"),
  code: z.string().min(1, "Class code is required"),
  level: z.number().int(),
  group: z.enum(["Science", "Business", "Humanities", "None"]).optional(),
  sections: z.array(z.string()).optional(),
});

export const classUpdateValidation = classCreateValidation.partial();

export const subjectCreateValidation = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  classId: z.string(),
  group: z.enum(["Science", "Business", "Humanities", "Common"]).optional(),
  markDistribution: z
    .object({
      cq: z.number(),
      mcq: z.number(),
      practical: z.number(),
      attendance: z.number(),
    })
    .optional(),
});

export const subjectUpdateValidation = subjectCreateValidation.partial();
