import type { CookieOptions, Response } from "express";
import { env, isProd } from "../config/env";

export const ACCESS_TOKEN_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_MS = 30 * 24 * 60 * 60 * 1000;

const base: CookieOptions = {
  httpOnly: true,
  sameSite: env.cookieSameSite,
  secure: env.cookieSecure || isProd || env.cookieSameSite === "none",
  path: "/",
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie("accessToken", accessToken, { ...base, maxAge: ACCESS_TOKEN_MS });
  res.cookie("refreshToken", refreshToken, { ...base, maxAge: REFRESH_TOKEN_MS });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", { ...base });
  res.clearCookie("refreshToken", { ...base });
}
