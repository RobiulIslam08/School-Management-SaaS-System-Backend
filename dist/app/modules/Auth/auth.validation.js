"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.twoFactorValidation = exports.loginValidation = void 0;
const zod_1 = require("zod");
exports.loginValidation = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.twoFactorValidation = zod_1.z.object({
    tempToken: zod_1.z.string().min(1, "Two-factor session is missing"),
    code: zod_1.z.string().min(6, "Authenticator code must be at least 6 digits"),
});
exports.forgotPasswordValidation = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email address"),
});
exports.resetPasswordValidation = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email address"),
    code: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Reset code must be 6 digits"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
