"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.createUserValidation = void 0;
const zod_1 = require("zod");
const permissions_1 = require("../../../lib/permissions");
exports.createUserValidation = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(permissions_1.ROLES).refine((role) => role !== "platform_owner", "Owner accounts cannot be created here"),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
    phone: zod_1.z.string().optional(),
});
exports.updateUserValidation = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.boolean().optional(),
    password: zod_1.z.string().min(8).optional(),
    role: zod_1.z.enum(permissions_1.ROLES).refine((role) => role !== "platform_owner", "Owner accounts cannot be created here").optional(),
});
