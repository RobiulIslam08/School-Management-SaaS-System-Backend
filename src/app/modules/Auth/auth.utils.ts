import { randomInt } from "crypto";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { clearAuthCookies, setAuthCookies } from "../../../lib/cookies";
import { ROLE_PERMISSIONS, type Role } from "../../../lib/permissions";
import { User } from "../../../models/User";
import type { PublicUser } from "./auth.interface";

export const RESET_TTL_MS = 15 * 60 * 1000;
export const RESET_COOLDOWN_MS = 60 * 1000;
export const RESET_MAX_ATTEMPTS = 5;
export const RESET_CODE_ROUNDS = 10;

export function generateResetCode(): string {
  return String(randomInt(100000, 1000000));
}

export function resetExpiresAt(from = new Date()): Date {
  return new Date(from.getTime() + RESET_TTL_MS);
}

export function isResetExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}

export function resetAttemptsExceeded(attemptCount: number, max = RESET_MAX_ATTEMPTS): boolean {
  return attemptCount >= max;
}

export function shouldRevealDevCode(nodeEnv = env.nodeEnv): boolean {
  return nodeEnv !== "production";
}

export function isEligibleForPortal(role: Role, ownerPortal: boolean): boolean {
  return ownerPortal ? role === "platform_owner" : role !== "platform_owner";
}

export function signAccess(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: "15m" });
}

export function signRefresh(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtRefreshSecret, { expiresIn: "7d" });
}

export function tokensFor(userId: string): { accessToken: string; refreshToken: string } {
  return { accessToken: signAccess(userId), refreshToken: signRefresh(userId) };
}

export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
  totpEnabled: boolean;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions.length ? user.permissions : ROLE_PERMISSIONS[user.role],
    totpEnabled: user.totpEnabled,
  };
}

export function attachAuthCookies(res: Response, user: InstanceType<typeof User>): PublicUser {
  const safe = toPublicUser({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    totpEnabled: user.totpEnabled,
  });
  const tokens = tokensFor(safe.id);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  return safe;
}

export { clearAuthCookies };
