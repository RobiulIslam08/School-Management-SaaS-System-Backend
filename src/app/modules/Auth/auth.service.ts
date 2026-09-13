import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { generateOtpAuthUri, generateSecret, verifyTotp } from "../../../lib/totp";
import { PasswordReset } from "../../../models/PasswordReset";
import { User } from "../../../models/User";
import { writeAudit } from "../../../services/audit.service";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import type { ForgotPasswordResult } from "./auth.interface";
import {
  generateResetCode,
  isEligibleForPortal,
  isResetExpired,
  RESET_CODE_ROUNDS,
  RESET_COOLDOWN_MS,
  resetAttemptsExceeded,
  resetExpiresAt,
  shouldRevealDevCode,
} from "./auth.utils";

export async function loginWithPassword(email: string, password: string, ownerOnly: boolean) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    throw new ApiError(401, msg.loginFailed);
  }
  const match = await bcrypt.compare(password, user.passwordHash).catch(() => false);
  if (!match) {
    throw new ApiError(401, msg.loginFailed);
  }
  if (ownerOnly && user.role !== "platform_owner") {
    throw new ApiError(403, "Owner portal sign-in failed. This account is not a platform owner.");
  }
  if (!ownerOnly && user.role === "platform_owner") {
    throw new ApiError(403, "Sign-in was blocked. Platform owners must use the owner portal.");
  }

  const needs2fa = user.role === "platform_owner" && user.totpEnabled && !env.ownerSkip2fa;
  if (needs2fa) {
    const tempToken = jwt.sign({ sub: user.id, step: "2fa" }, env.jwtSecret, { expiresIn: "5m" });
    return { requiresTwoFactor: true, tempToken, user: null };
  }

  return { requiresTwoFactor: false, tempToken: null, user };
}

export async function verifyOwnerTotp(tempToken: string, code: string) {
  let payload: { sub: string; step?: string };
  try {
    payload = jwt.verify(tempToken, env.jwtSecret) as { sub: string; step?: string };
  } catch {
    throw new ApiError(401, "Two-factor session expired. Sign in again.");
  }
  if (payload.step !== "2fa") {
    throw new ApiError(401, "Two-factor session is invalid. Sign in again.");
  }
  const user = await User.findById(payload.sub);
  if (!user?.totpSecret) {
    throw new ApiError(400, "Two-factor was not saved for this owner account.");
  }
  const valid = verifyTotp(user.totpSecret, code);
  if (!valid) {
    throw new ApiError(401, "Authenticator code is incorrect. Sign-in was not completed.");
  }
  return user;
}

export async function setupOwnerTotp(userId: string) {
  const user = await User.findById(userId);
  if (!user || user.role !== "platform_owner") {
    throw new ApiError(403, "Two-factor was not saved. Only the platform owner can enable it.");
  }
  const secret = generateSecret();
  user.totpSecret = secret;
  user.totpEnabled = true;
  await user.save();
  const otpauth = generateOtpAuthUri({ issuer: "SchoolSaaS Owner", label: user.email, secret });
  return { secret, otpauth };
}

export async function refreshSession(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as { sub: string };
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new ApiError(401, msg.sessionExpired);
    }
    return user;
  } catch {
    throw new ApiError(401, msg.sessionExpired);
  }
}

export async function getSessionPayload() {
  const { FeaturePackage, normalizeModules } = await import("../../../models/FeaturePackage");
  const { SchoolSettings } = await import("../../../models/SchoolSettings");
  const [settings, pack] = await Promise.all([SchoolSettings.findOne(), FeaturePackage.findOne()]);
  return { settings, features: normalizeModules(pack?.modules) };
}

export async function requestPasswordReset(emailRaw: string, ownerPortal: boolean): Promise<ForgotPasswordResult> {
  const email = emailRaw.toLowerCase().trim();
  const generic: ForgotPasswordResult = { requested: true, delivery: "pending" };

  const user = await User.findOne({ email, isActive: true });
  const eligible = !!user && isEligibleForPortal(user.role, ownerPortal);

  if (!eligible) {
    await bcrypt.hash("000000", RESET_CODE_ROUNDS);
    return generic;
  }

  const recent = await PasswordReset.findOne({
    email,
    ownerPortal,
    consumedAt: null,
    createdAt: { $gte: new Date(Date.now() - RESET_COOLDOWN_MS) },
  });
  if (recent) {
    return generic;
  }

  await PasswordReset.updateMany({ email, ownerPortal, consumedAt: null }, { $set: { consumedAt: new Date() } });

  const code = generateResetCode();
  await PasswordReset.create({
    email,
    codeHash: await bcrypt.hash(code, RESET_CODE_ROUNDS),
    expiresAt: resetExpiresAt(),
    attemptCount: 0,
    ownerPortal,
  });

  if (shouldRevealDevCode()) {
    return { ...generic, devCode: code };
  }
  return generic;
}

export async function resetPasswordWithCode(params: {
  email: string;
  code: string;
  password: string;
  ownerPortal: boolean;
}): Promise<void> {
  const email = params.email.toLowerCase().trim();
  const reset = await PasswordReset.findOne({
    email,
    ownerPortal: params.ownerPortal,
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (!reset || isResetExpired(reset.expiresAt)) {
    throw new ApiError(400, msg.resetInvalid);
  }
  if (resetAttemptsExceeded(reset.attemptCount)) {
    reset.consumedAt = new Date();
    await reset.save();
    throw new ApiError(400, msg.resetTooMany);
  }

  const match = await bcrypt.compare(params.code, reset.codeHash).catch(() => false);
  if (!match) {
    reset.attemptCount += 1;
    if (resetAttemptsExceeded(reset.attemptCount)) {
      reset.consumedAt = new Date();
      await reset.save();
      throw new ApiError(400, msg.resetTooMany);
    }
    await reset.save();
    throw new ApiError(400, msg.resetInvalid);
  }

  const user = await User.findOne({ email, isActive: true });
  if (!user || !isEligibleForPortal(user.role, params.ownerPortal)) {
    throw new ApiError(400, msg.resetInvalid);
  }

  user.passwordHash = await bcrypt.hash(params.password, 10);
  await user.save();
  reset.consumedAt = new Date();
  await reset.save();
  await PasswordReset.updateMany({ email, consumedAt: null }, { $set: { consumedAt: new Date() } });
  await writeAudit({
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
