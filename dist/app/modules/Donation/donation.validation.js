"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationUpdateValidation = exports.donationCreateValidation = void 0;
const zod_1 = require("zod");
const Fee_1 = require("../../../models/Fee");
exports.donationCreateValidation = zod_1.z.object({
    date: zod_1.z.string().min(1, "Date is required"),
    amount: zod_1.z.number().positive("Amount must be greater than zero"),
    donorName: zod_1.z.string().min(1, "Donor name is required").max(120),
    donorPhone: zod_1.z.string().max(40).optional(),
    donorAddress: zod_1.z.string().max(300).optional(),
    purpose: zod_1.z.string().max(200).optional(),
    method: zod_1.z.enum(Fee_1.PAYMENT_METHODS).optional(),
    refNo: zod_1.z.string().max(80).optional(),
    note: zod_1.z.string().max(2000).optional(),
    academicYear: zod_1.z.string().max(20).optional(),
});
exports.donationUpdateValidation = exports.donationCreateValidation.partial();
