import type { CookieOptions, Response } from "express";
import { env, isProd } from "../config/env";

const base: CookieOptions = {
  httpOnly: true,
  sameSite: env.cookieSameSite,
  secure: env.cookieSecure || isProd || env.cookieSameSite === "none",
  path: "/",
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie("accessToken", accessToken, { ...base, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", { ...base });
  res.clearCookie("refreshToken", { ...base });
}
