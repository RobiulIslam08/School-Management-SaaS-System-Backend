"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithPassword = loginWithPassword;
exports.verifyOwnerTotp = verifyOwnerTotp;
exports.setupOwnerTotp = setupOwnerTotp;
exports.refreshSession = refreshSession;
exports.getSessionPayload = getSessionPayload;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPasswordWithCode = resetPasswordWithCode;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
const totp_1 = require("../../../lib/totp");
const PasswordReset_1 = require("../../../models/PasswordReset");
const User_1 = require("../../../models/User");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const auth_utils_1 = require("./auth.utils");
async function loginWithPassword(email, password, ownerOnly) {
    const user = await User_1.User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
        throw new ApiError_1.ApiError(401, messages_1.msg.loginFailed);
    }
    const match = await bcryptjs_1.default.compare(password, user.passwordHash).catch(() => false);
    if (!match) {
        throw new ApiError_1.ApiError(401, messages_1.msg.loginFailed);
    }
    if (ownerOnly && user.role !== "platform_owner") {
        throw new ApiError_1.ApiError(403, "Owner portal sign-in failed. This account is not a platform owner.");
    }
    if (!ownerOnly && user.role === "platform_owner") {
        throw new ApiError_1.ApiError(403, "Sign-in was blocked. Platform owners must use the owner portal.");
    }
    const needs2fa = user.role === "platform_owner" && user.totpEnabled && !env_1.env.ownerSkip2fa;
    if (needs2fa) {
        const tempToken = jsonwebtoken_1.default.sign({ sub: user.id, step: "2fa" }, env_1.env.jwtSecret, { expiresIn: "5m" });
        return { requiresTwoFactor: true, tempToken, user: null };
    }
    return { requiresTwoFactor: false, tempToken: null, user };
}
async function verifyOwnerTotp(tempToken, code) {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(tempToken, env_1.env.jwtSecret);
    }
    catch {
        throw new ApiError_1.ApiError(401, "Two-factor session expired. Sign in again.");
    }
    if (payload.step !== "2fa") {
        throw new ApiError_1.ApiError(401, "Two-factor session is invalid. Sign in again.");
    }
    const user = await User_1.User.findById(payload.sub);
    if (!user?.totpSecret) {
        throw new ApiError_1.ApiError(400, "Two-factor was not saved for this owner account.");
    }
    const valid = (0, totp_1.verifyTotp)(user.totpSecret, code);
    if (!valid) {
        throw new ApiError_1.ApiError(401, "Authenticator code is incorrect. Sign-in was not completed.");
    }
    return user;
}
async function setupOwnerTotp(userId) {
    const user = await User_1.User.findById(userId);
    if (!user || user.role !== "platform_owner") {
        throw new ApiError_1.ApiError(403, "Two-factor was not saved. Only the platform owner can enable it.");
    }
    const secret = (0, totp_1.generateSecret)();
    user.totpSecret = secret;
    user.totpEnabled = true;
    await user.save();
    const otpauth = (0, totp_1.generateOtpAuthUri)({ issuer: "SchoolSaaS Owner", label: user.email, secret });
    return { secret, otpauth };
}
async function refreshSession(refreshToken) {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, env_1.env.jwtRefreshSecret);
        const user = await User_1.User.findById(payload.sub);
        if (!user || !user.isActive) {
            throw new ApiError_1.ApiError(401, messages_1.msg.sessionExpired);
        }
        return user;
    }
    catch {
        throw new ApiError_1.ApiError(401, messages_1.msg.sessionExpired);
    }
}
async function getSessionPayload() {
    const { FeaturePackage, normalizeModules } = await Promise.resolve().then(() => __importStar(require("../../../models/FeaturePackage")));
    const { SchoolSettings } = await Promise.resolve().then(() => __importStar(require("../../../models/SchoolSettings")));
    const [settings, pack] = await Promise.all([SchoolSettings.findOne(), FeaturePackage.findOne()]);
    return { settings, features: normalizeModules(pack?.modules) };
}
async function requestPasswordReset(emailRaw, ownerPortal) {
    const email = emailRaw.toLowerCase().trim();
    const generic = { requested: true, delivery: "pending" };
    const user = await User_1.User.findOne({ email, isActive: true });
    const eligible = !!user && (0, auth_utils_1.isEligibleForPortal)(user.role, ownerPortal);
    if (!eligible) {
        await bcryptjs_1.default.hash("000000", auth_utils_1.RESET_CODE_ROUNDS);
        return generic;
    }
    const recent = await PasswordReset_1.PasswordReset.findOne({
        email,
        ownerPortal,
        consumedAt: null,
        createdAt: { $gte: new Date(Date.now() - auth_utils_1.RESET_COOLDOWN_MS) },
    });
    if (recent) {
        return generic;
    }
    await PasswordReset_1.PasswordReset.updateMany({ email, ownerPortal, consumedAt: null }, { $set: { consumedAt: new Date() } });
    const code = (0, auth_utils_1.generateResetCode)();
    await PasswordReset_1.PasswordReset.create({
        email,
        codeHash: await bcryptjs_1.default.hash(code, auth_utils_1.RESET_CODE_ROUNDS),
        expiresAt: (0, auth_utils_1.resetExpiresAt)(),
        attemptCount: 0,
        ownerPortal,
    });
    if ((0, auth_utils_1.shouldRevealDevCode)()) {
        return { ...generic, devCode: code };
    }
    return generic;
}
async function resetPasswordWithCode(params) {
    const email = params.email.toLowerCase().trim();
    const reset = await PasswordReset_1.PasswordReset.findOne({
        email,
        ownerPortal: params.ownerPortal,
        consumedAt: null,
    }).sort({ createdAt: -1 });
    if (!reset || (0, auth_utils_1.isResetExpired)(reset.expiresAt)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.resetInvalid);
    }
    if ((0, auth_utils_1.resetAttemptsExceeded)(reset.attemptCount)) {
        reset.consumedAt = new Date();
        await reset.save();
        throw new ApiError_1.ApiError(400, messages_1.msg.resetTooMany);
    }
    const match = await bcryptjs_1.default.compare(params.code, reset.codeHash).catch(() => false);
    if (!match) {
        reset.attemptCount += 1;
        if ((0, auth_utils_1.resetAttemptsExceeded)(reset.attemptCount)) {
            reset.consumedAt = new Date();
            await reset.save();
            throw new ApiError_1.ApiError(400, messages_1.msg.resetTooMany);
        }
        await reset.save();
        throw new ApiError_1.ApiError(400, messages_1.msg.resetInvalid);
    }
    const user = await User_1.User.findOne({ email, isActive: true });
    if (!user || !(0, auth_utils_1.isEligibleForPortal)(user.role, params.ownerPortal)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.resetInvalid);
    }
    user.passwordHash = await bcryptjs_1.default.hash(params.password, 10);
    await user.save();
    reset.consumedAt = new Date();
    await reset.save();
    await PasswordReset_1.PasswordReset.updateMany({ email, consumedAt: null }, { $set: { consumedAt: new Date() } });
    await (0, audit_service_1.writeAudit)({
        user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
        },
        action: "password_reset",
        entity: "User",
        entityId: String(user._id),
    });
}
