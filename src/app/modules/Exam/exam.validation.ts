import { z } from "zod";

export const examCreateValidation = z.object({
  name: z.string().min(1, "Exam name is required"),
  code: z.string().min(1, "Exam code is required"),
  weight: z.number().min(0).max(100).optional().default(0),
  academicYear: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const gradingRuleValidation = z.object({
  name: z.string(),
  academicYear: z.string(),
  scale: z.enum(["gpa5", "letter", "percentage"]),
  weights: z.array(z.object({ examTypeId: z.string(), weight: z.number() })),
  tieBreak: z.array(z.enum(["totalMarks", "gpa", "cq", "attendance"])).optional(),
  isDefault: z.boolean().optional(),
  classId: z.string().optional(),
});

export const resultSaveValidation = z.object({
  studentId: z.string(),
  examTypeId: z.string(),
  subjectMarks: z.array(
    z.object({
      subjectId: z.string(),
      cq: z.number(),
      mcq: z.number(),
      practical: z.number(),
      attendance: z.number(),
    })
  ),
});
