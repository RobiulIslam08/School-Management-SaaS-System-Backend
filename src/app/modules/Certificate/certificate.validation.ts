import { z } from "zod";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");

export const issueCertificateValidation = z.object({
  templateId: objectId,
  studentId: objectId,
  purpose: z.string().max(200).optional(),
  conduct: z.enum(["good", "excellent"]).optional(),
  leavingDate: z.string().optional(),
  reason: z.string().max(200).optional(),
  language: z.enum(["bn", "en"]).optional(),
});

export const updateTemplateValidation = z.object({
  name: z.string().min(1).max(80).optional(),
  titleBn: z.string().min(1).max(120).optional(),
  titleEn: z.string().min(1).max(120).optional(),
  bodyBn: z.string().min(1).max(4000).optional(),
  bodyEn: z.string().min(1).max(4000).optional(),
  isActive: z.boolean().optional(),
});
