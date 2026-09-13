"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.RESET_CODE_ROUNDS = exports.RESET_MAX_ATTEMPTS = exports.RESET_COOLDOWN_MS = exports.RESET_TTL_MS = void 0;
exports.generateResetCode = generateResetCode;
exports.resetExpiresAt = resetExpiresAt;
exports.isResetExpired = isResetExpired;
exports.resetAttemptsExceeded = resetAttemptsExceeded;
exports.shouldRevealDevCode = shouldRevealDevCode;
exports.isEligibleForPortal = isEligibleForPortal;
exports.signAccess = signAccess;
exports.signRefresh = signRefresh;
exports.tokensFor = tokensFor;
exports.toPublicUser = toPublicUser;
exports.attachAuthCookies = attachAuthCookies;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
const cookies_1 = require("../../../lib/cookies");
Object.defineProperty(exports, "clearAuthCookies", { enumerable: true, get: function () { return cookies_1.clearAuthCookies; } });
const permissions_1 = require("../../../lib/permissions");
exports.RESET_TTL_MS = 15 * 60 * 1000;
exports.RESET_COOLDOWN_MS = 60 * 1000;
exports.RESET_MAX_ATTEMPTS = 5;
exports.RESET_CODE_ROUNDS = 10;
function generateResetCode() {
    return String((0, crypto_1.randomInt)(100000, 1000000));
}
function resetExpiresAt(from = new Date()) {
    return new Date(from.getTime() + exports.RESET_TTL_MS);
}
function isResetExpired(expiresAt, now = new Date()) {
    return expiresAt.getTime() <= now.getTime();
}
function resetAttemptsExceeded(attemptCount, max = exports.RESET_MAX_ATTEMPTS) {
    return attemptCount >= max;
}
function shouldRevealDevCode(nodeEnv = env_1.env.nodeEnv) {
    return nodeEnv !== "production";
}
function isEligibleForPortal(role, ownerPortal) {
    return ownerPortal ? role === "platform_owner" : role !== "platform_owner";
}
function signAccess(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId }, env_1.env.jwtSecret, { expiresIn: "15m" });
}
function signRefresh(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId }, env_1.env.jwtRefreshSecret, { expiresIn: "7d" });
}
function tokensFor(userId) {
    return { accessToken: signAccess(userId), refreshToken: signRefresh(userId) };
}
function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions.length ? user.permissions : permissions_1.ROLE_PERMISSIONS[user.role],
        totpEnabled: user.totpEnabled,
    };
}
function attachAuthCookies(res, user) {
    const safe = toPublicUser({
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        totpEnabled: user.totpEnabled,
    });
    const tokens = tokensFor(safe.id);
    (0, cookies_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken);
    return safe;
}
