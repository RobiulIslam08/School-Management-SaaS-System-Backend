import { z } from "zod";
import { addressSchema, guardianSchema } from "../Student/student.validation";

const optionalText = z.string().max(80).optional();
const photo = z
  .string()
  .max(280000)
  .optional()
  .refine(
    (value) => !value || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value),
    "Photo must be a small JPEG, PNG, or WebP."
  );

export const publicAdmissionValidation = z.object({
  name: z.string().min(2, "Applicant name is required").max(80),
  nameBn: optionalText,
  gender: z.enum(["male", "female", "other"]),
  academicYear: z.string().min(4).max(12),
  classId: z.string().min(1, "Choose a class"),
  section: z.string().max(20).optional(),
  group: z.enum(["Science", "Business", "Humanities", "None"]).optional(),
  phone: z.string().max(20).optional(),
  email: z.union([z.literal(""), z.string().email("Email is not valid").max(80)]).optional(),
  dob: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be YYYY-MM-DD")]).optional(),
  birthRegNo: z.string().max(40).optional(),
  bloodGroup: z.string().max(8).optional(),
  religion: z.string().max(40).optional(),
  photoUrl: photo,
  previousSchool: z.string().max(120).optional(),
  guardian: guardianSchema.extend({
    guardianName: z.string().min(2, "Guardian name is required").max(80),
    phone: z.string().min(6, "Guardian phone is required").max(20),
  }),
  address: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
});
