"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicAdmissionValidation = void 0;
const zod_1 = require("zod");
const student_validation_1 = require("../Student/student.validation");
const optionalText = zod_1.z.string().max(80).optional();
const photo = zod_1.z
    .string()
    .max(280000)
    .optional()
    .refine((value) => !value || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value), "Photo must be a small JPEG, PNG, or WebP.");
exports.publicAdmissionValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, "Applicant name is required").max(80),
    nameBn: optionalText,
    gender: zod_1.z.enum(["male", "female", "other"]),
    academicYear: zod_1.z.string().min(4).max(12),
    classId: zod_1.z.string().min(1, "Choose a class"),
    section: zod_1.z.string().max(20).optional(),
    group: zod_1.z.enum(["Science", "Business", "Humanities", "None"]).optional(),
    phone: zod_1.z.string().max(20).optional(),
    email: zod_1.z.union([zod_1.z.literal(""), zod_1.z.string().email("Email is not valid").max(80)]).optional(),
    dob: zod_1.z.union([zod_1.z.literal(""), zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be YYYY-MM-DD")]).optional(),
    birthRegNo: zod_1.z.string().max(40).optional(),
    bloodGroup: zod_1.z.string().max(8).optional(),
    religion: zod_1.z.string().max(40).optional(),
    photoUrl: photo,
    previousSchool: zod_1.z.string().max(120).optional(),
    guardian: student_validation_1.guardianSchema.extend({
        guardianName: zod_1.z.string().min(2, "Guardian name is required").max(80),
        phone: zod_1.z.string().min(6, "Guardian phone is required").max(20),
    }),
    address: student_validation_1.addressSchema.optional(),
    permanentAddress: student_validation_1.addressSchema.optional(),
});
