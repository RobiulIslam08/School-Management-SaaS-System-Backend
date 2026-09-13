import type { Request, Response } from "express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { writeAudit } from "../../../services/audit.service";
import {
  getSessionPayload,
  loginWithPassword,
  refreshSession,
  requestPasswordReset,
  resetPasswordWithCode,
  setupOwnerTotp,
  verifyOwnerTotp,
} from "./auth.service";
import { attachAuthCookies, clearAuthCookies } from "./auth.utils";

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const result = await loginWithPassword(req.body.email, req.body.password, false);
    if (result.requiresTwoFactor) {
      ok(res, { requiresTwoFactor: true, tempToken: result.tempToken }, msg.twoFactorNeeded);
      return;
    }
    if (!result.user) throw new ApiError(401, msg.loginFailed);
    const user = attachAuthCookies(res, result.user);
    ok(res, { requiresTwoFactor: false, user }, msg.signedIn);
  },

  async ownerLogin(req: Request, res: Response): Promise<void> {
    const result = await loginWithPassword(req.body.email, req.body.password, true);
    if (result.requiresTwoFactor) {
      ok(res, { requiresTwoFactor: true, tempToken: result.tempToken }, msg.twoFactorNeeded);
      return;
    }
    if (!result.user) throw new ApiError(401, msg.loginFailed);
    const user = attachAuthCookies(res, result.user);
    await writeAudit({ user: { ...user, id: user.id }, action: "login", entity: "Owner" });
    ok(res, { requiresTwoFactor: false, user }, msg.signedIn);
  },

  async verify2fa(req: Request, res: Response): Promise<void> {
    const userDoc = await verifyOwnerTotp(req.body.tempToken, req.body.code);
    const user = attachAuthCookies(res, userDoc);
    ok(res, { requiresTwoFactor: false, user }, msg.signedIn);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) throw new ApiError(401, msg.sessionExpired);
    const userDoc = await refreshSession(token);
    const user = attachAuthCookies(res, userDoc);
    ok(res, { user }, "Session refreshed successfully.");
  },

  async logout(_req: Request, res: Response): Promise<void> {
    clearAuthCookies(res);
    ok(res, { loggedOut: true }, msg.signedOut);
  },

  async me(req: Request, res: Response): Promise<void> {
    const extra = await getSessionPayload();
    ok(res, { user: req.user, ...extra }, "Session loaded successfully.");
  },

  async setup2fa(req: Request, res: Response): Promise<void> {
    const data = await setupOwnerTotp(req.user!.id);
    await writeAudit({ user: req.user, action: "2fa_setup", entity: "Owner" });
    ok(res, data, msg.twoFactorSaved);
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const data = await requestPasswordReset(req.body.email, false);
    ok(res, data, msg.resetRequested);
  },

  async ownerForgotPassword(req: Request, res: Response): Promise<void> {
    const data = await requestPasswordReset(req.body.email, true);
    ok(res, data, msg.resetRequested);
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    await resetPasswordWithCode({
      email: req.body.email,
      code: req.body.code,
      password: req.body.password,
      ownerPortal: false,
    });
    ok(res, { updated: true }, msg.resetDone);
  },

  async ownerResetPassword(req: Request, res: Response): Promise<void> {
    await resetPasswordWithCode({
      email: req.body.email,
      code: req.body.code,
      password: req.body.password,
      ownerPortal: true,
    });
    ok(res, { updated: true }, msg.resetDone);
  },
};
