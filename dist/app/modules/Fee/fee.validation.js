"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchPaymentValidation = exports.paymentValidation = exports.feeLedgerValidation = exports.feeStructureValidation = void 0;
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
    title: zod_1.z.string().trim().min(1, "Fee title is required"),
    dueAmount: zod_1.z.number().positive(),
    discount: zod_1.z.number().nonnegative().optional(),
});
exports.paymentValidation = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    method: zod_1.z.enum(Fee_1.PAYMENT_METHODS),
    refNo: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
});
const batchPaymentLine = zod_1.z
    .object({
    ledgerId: zod_1.z.string().min(1).optional(),
    title: zod_1.z.string().min(1).optional(),
    amount: zod_1.z.number().positive(),
})
    .refine((line) => Boolean(line.ledgerId || line.title), {
    message: "Each line needs a ledger or a fee title",
});
exports.batchPaymentValidation = zod_1.z
    .object({
    studentId: zod_1.z.string().min(1).optional(),
    method: zod_1.z.enum(Fee_1.PAYMENT_METHODS),
    refNo: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    lines: zod_1.z.array(batchPaymentLine).min(1, "At least one fee line is required"),
})
    .refine((body) => body.lines.every((line) => line.ledgerId || (body.studentId && line.title)), {
    message: "Student is required when a fee title has no ledger",
});
