import { z } from "zod";

export const settingsUpdateValidation = z.object({
  name: z.string().min(2).optional(),
  logoUrl: z.string().optional(),
  address: z.string().optional(),
  eiin: z.string().optional(),
  establishedYear: z.number().int().min(1800).max(2100).nullable().optional(),
  motto: z.string().optional(),
  theme: z.object({ primary: z.string().optional(), radius: z.string().optional() }).optional(),
  academicYear: z.string().optional(),
  smsApiKey: z.string().optional(),
  defaultLanguage: z.enum(["bn", "en"]).optional(),
});
