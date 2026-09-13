import { z } from "zod";

const sectionSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().min(0).optional(),
  classTeacherId: z.string().optional(),
});

export const classCreateValidation = z.object({
  name: z.string().min(1, "Class name is required"),
  code: z.string().min(1, "Class code is required"),
  level: z.number().int(),
  sortOrder: z.number().int().optional(),
  group: z.enum(["Science", "Business", "Humanities", "None"]).optional(),
  sections: z.array(z.union([z.string(), sectionSchema])).optional(),
  isActive: z.boolean().optional(),
});

export const classUpdateValidation = classCreateValidation.partial();

export const sectionValidation = sectionSchema;
