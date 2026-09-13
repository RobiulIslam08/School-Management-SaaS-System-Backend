"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidation = exports.feeLedgerValidation = exports.feeStructureValidation = void 0;
const zod_1 = require("zod");
const Fee_1 = require("../../../models/Fee");
exports.feeStructureValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Fee name is required"),
    classId: zod_1.z.string().optional(),
    academicYear: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    type: zod_1.z.enum(["monthly", "one_time"]),
    month: zod_1.z.string().optional(),
});
exports.feeLedgerValidation = zod_1.z.object({
    studentId: zod_1.z.string(),
    feeStructureId: zod_1.z.string().optional(),
    academicYear: zod_1.z.string(),
    title: zod_1.z.string(),
    dueAmount: zod_1.z.number().positive(),
    discount: zod_1.z.number().optional(),
});
exports.paymentValidation = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    method: zod_1.z.enum(Fee_1.PAYMENT_METHODS),
    refNo: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
});
