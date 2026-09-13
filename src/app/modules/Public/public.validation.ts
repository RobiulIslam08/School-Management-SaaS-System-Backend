import { z } from "zod";

export const publicAdmissionValidation = z.object({
  name: z.string().min(2, "Applicant name is required"),
  gender: z.enum(["male", "female", "other"]),
  academicYear: z.string(),
  classId: z.string().optional(),
  phone: z.string().optional(),
  guardian: z
    .object({
      guardianName: z.string().optional(),
      phone: z.string().optional(),
      nid: z.string().optional(),
    })
    .optional(),
  address: z
    .object({
      district: z.string().optional(),
      upazila: z.string().optional(),
      area: z.string().optional(),
    })
    .optional(),
});
