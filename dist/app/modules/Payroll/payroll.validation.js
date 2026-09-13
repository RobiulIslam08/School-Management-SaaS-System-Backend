"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollCreateValidation = void 0;
const zod_1 = require("zod");
exports.payrollCreateValidation = zod_1.z.object({
    teacherId: zod_1.z.string(),
    month: zod_1.z.string().min(1, "Payroll month is required"),
    advance: zod_1.z.number().optional(),
    deduction: zod_1.z.number().optional(),
});
