import { z } from "zod";

const marks = z.object({
  cq: z.number(),
  mcq: z.number(),
  practical: z.number(),
  attendance: z.number(),
});

export const subjectCreateValidation = z.object({
  name: z.string().min(1, "Subject name is required"),
  nameBn: z.string().optional(),
  code: z.string().min(1, "Subject code is required"),
  classId: z.string().min(1),
  group: z.enum(["Science", "Business", "Humanities", "Common"]).optional(),
  markDistribution: marks.optional(),
  sortOrder: z.number().int().optional(),
  compulsory: z.boolean().optional(),
  teacherId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const subjectUpdateValidation = subjectCreateValidation.partial();

export const subjectReorderValidation = z.object({
  classId: z.string().min(1),
  orderedIds: z.array(z.string()).min(1),
});

export const subjectTeacherValidation = z.object({
  teacherId: z.string().optional(),
});
