"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicAdmissionValidation = void 0;
const zod_1 = require("zod");
exports.publicAdmissionValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, "Applicant name is required"),
    gender: zod_1.z.enum(["male", "female", "other"]),
    academicYear: zod_1.z.string(),
    classId: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    guardian: zod_1.z
        .object({
        guardianName: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        nid: zod_1.z.string().optional(),
    })
        .optional(),
    address: zod_1.z
        .object({
        district: zod_1.z.string().optional(),
        upazila: zod_1.z.string().optional(),
        area: zod_1.z.string().optional(),
    })
        .optional(),
});
