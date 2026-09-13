"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherUpdateValidation = exports.teacherCreateValidation = void 0;
const zod_1 = require("zod");
exports.teacherCreateValidation = zod_1.z.object({
    staffId: zod_1.z.string().optional(),
    name: zod_1.z.string().min(2, "Teacher name is required"),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    phone: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    subjects: zod_1.z.array(zod_1.z.string()).optional(),
    salaryStructure: zod_1.z
        .object({
        basic: zod_1.z.number(),
        house: zod_1.z.number(),
        medical: zod_1.z.number(),
        other: zod_1.z.number(),
    })
        .optional(),
});
exports.teacherUpdateValidation = exports.teacherCreateValidation.partial();
