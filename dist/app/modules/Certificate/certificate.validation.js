"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplateValidation = exports.issueCertificateValidation = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");
exports.issueCertificateValidation = zod_1.z.object({
    templateId: objectId,
    studentId: objectId,
    purpose: zod_1.z.string().max(200).optional(),
    conduct: zod_1.z.enum(["good", "excellent"]).optional(),
    leavingDate: zod_1.z.string().optional(),
    reason: zod_1.z.string().max(200).optional(),
    language: zod_1.z.enum(["bn", "en"]).optional(),
});
exports.updateTemplateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1).max(80).optional(),
    titleBn: zod_1.z.string().min(1).max(120).optional(),
    titleEn: zod_1.z.string().min(1).max(120).optional(),
    bodyBn: zod_1.z.string().min(1).max(4000).optional(),
    bodyEn: zod_1.z.string().min(1).max(4000).optional(),
    isActive: zod_1.z.boolean().optional(),
});
