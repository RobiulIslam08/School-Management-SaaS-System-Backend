"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseUpdateValidation = exports.expenseCreateValidation = void 0;
const zod_1 = require("zod");
const Accounts_1 = require("../../../models/Accounts");
const Fee_1 = require("../../../models/Fee");
exports.expenseCreateValidation = zod_1.z.object({
    date: zod_1.z.string().min(1, "Date is required"),
    amount: zod_1.z.number().positive("Amount must be greater than zero"),
    category: zod_1.z.enum(Accounts_1.EXPENSE_CATEGORIES).optional(),
    title: zod_1.z.string().min(1, "Title is required").max(200),
    note: zod_1.z.string().max(2000).optional(),
    paidVia: zod_1.z.enum(Fee_1.PAYMENT_METHODS).optional(),
    paidByName: zod_1.z.string().max(120).optional(),
    vendor: zod_1.z.string().max(120).optional(),
    refNo: zod_1.z.string().max(80).optional(),
    academicYear: zod_1.z.string().max(20).optional(),
});
exports.expenseUpdateValidation = exports.expenseCreateValidation.partial();
