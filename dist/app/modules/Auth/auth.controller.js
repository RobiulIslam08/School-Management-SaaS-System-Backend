"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const audit_service_1 = require("../../../services/audit.service");
const auth_service_1 = require("./auth.service");
const auth_utils_1 = require("./auth.utils");
exports.authController = {
    async login(req, res) {
        const result = await (0, auth_service_1.loginWithPassword)(req.body.email, req.body.password, false);
        if (result.requiresTwoFactor) {
            (0, respond_1.ok)(res, { requiresTwoFactor: true, tempToken: result.tempToken }, messages_1.msg.twoFactorNeeded);
            return;
        }
        if (!result.user)
            throw new ApiError_1.ApiError(401, messages_1.msg.loginFailed);
        const user = (0, auth_utils_1.attachAuthCookies)(res, result.user);
        (0, respond_1.ok)(res, { requiresTwoFactor: false, user }, messages_1.msg.signedIn);
    },
    async ownerLogin(req, res) {
        const result = await (0, auth_service_1.loginWithPassword)(req.body.email, req.body.password, true);
        if (result.requiresTwoFactor) {
            (0, respond_1.ok)(res, { requiresTwoFactor: true, tempToken: result.tempToken }, messages_1.msg.twoFactorNeeded);
            return;
        }
        if (!result.user)
            throw new ApiError_1.ApiError(401, messages_1.msg.loginFailed);
        const user = (0, auth_utils_1.attachAuthCookies)(res, result.user);
        await (0, audit_service_1.writeAudit)({ user: { ...user, id: user.id }, action: "login", entity: "Owner" });
        (0, respond_1.ok)(res, { requiresTwoFactor: false, user }, messages_1.msg.signedIn);
    },
    async verify2fa(req, res) {
        const userDoc = await (0, auth_service_1.verifyOwnerTotp)(req.body.tempToken, req.body.code);
        const user = (0, auth_utils_1.attachAuthCookies)(res, userDoc);
        (0, respond_1.ok)(res, { requiresTwoFactor: false, user }, messages_1.msg.signedIn);
    },
    async refresh(req, res) {
        const token = req.cookies?.refreshToken;
        if (!token)
            throw new ApiError_1.ApiError(401, messages_1.msg.sessionExpired);
        const userDoc = await (0, auth_service_1.refreshSession)(token);
        const user = (0, auth_utils_1.attachAuthCookies)(res, userDoc);
        (0, respond_1.ok)(res, { user }, "Session refreshed successfully.");
    },
    async logout(_req, res) {
        (0, auth_utils_1.clearAuthCookies)(res);
        (0, respond_1.ok)(res, { loggedOut: true }, messages_1.msg.signedOut);
    },
    async me(req, res) {
        const extra = await (0, auth_service_1.getSessionPayload)();
        (0, respond_1.ok)(res, { user: req.user, ...extra }, "Session loaded successfully.");
    },
    async setup2fa(req, res) {
        const data = await (0, auth_service_1.setupOwnerTotp)(req.user.id);
        await (0, audit_service_1.writeAudit)({ user: req.user, action: "2fa_setup", entity: "Owner" });
        (0, respond_1.ok)(res, data, messages_1.msg.twoFactorSaved);
    },
    async forgotPassword(req, res) {
        const data = await (0, auth_service_1.requestPasswordReset)(req.body.email, false);
        (0, respond_1.ok)(res, data, messages_1.msg.resetRequested);
    },
    async ownerForgotPassword(req, res) {
        const data = await (0, auth_service_1.requestPasswordReset)(req.body.email, true);
        (0, respond_1.ok)(res, data, messages_1.msg.resetRequested);
    },
    async resetPassword(req, res) {
        await (0, auth_service_1.resetPasswordWithCode)({
            email: req.body.email,
            code: req.body.code,
            password: req.body.password,
            ownerPortal: false,
        });
        (0, respond_1.ok)(res, { updated: true }, messages_1.msg.resetDone);
    },
    async ownerResetPassword(req, res) {
        await (0, auth_service_1.resetPasswordWithCode)({
            email: req.body.email,
            code: req.body.code,
            password: req.body.password,
            ownerPortal: true,
        });
        (0, respond_1.ok)(res, { updated: true }, messages_1.msg.resetDone);
    },
};
