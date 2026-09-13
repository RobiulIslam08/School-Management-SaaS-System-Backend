import { randomBytes } from "crypto";
import dotenv from "dotenv";
import path from "path";

// Vercel injects env in the dashboard. Loading a missing `.env` only logs noise.
if (!process.env.VERCEL) {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const isProduction = process.env.NODE_ENV === "production";
const DEV_JWT = "dev-access-secret-change-me";
const DEV_REFRESH = "dev-refresh-secret-change-me";

export const missingEnv: string[] = [];

function rememberMissing(name: string): void {
  if (!missingEnv.includes(name)) missingEnv.push(name);
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function resolveSecret(name: string, fallback: string): string {
  if (process.env[name]) return process.env[name] as string;
  if (!isProduction) return fallback;
  return randomBytes(32).toString("hex");
}

if (isProduction && !process.env.MONGODB_URI) rememberMissing("MONGODB_URI");

const cookieSameSiteRaw = (process.env.COOKIE_SAMESITE ?? "lax").toLowerCase();
const cookieSameSite = cookieSameSiteRaw === "none" || cookieSameSiteRaw === "strict" ? cookieSameSiteRaw : "lax";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: isProduction
    ? (process.env.MONGODB_URI ?? "")
    : required("MONGODB_URI", "mongodb://127.0.0.1:27017/school_management"),
  jwtSecret: resolveSecret("JWT_SECRET", DEV_JWT),
  jwtRefreshSecret: resolveSecret("JWT_REFRESH_SECRET", DEV_REFRESH),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? (isProduction ? "" : "http://localhost:3000"),
  cookieSecure: process.env.COOKIE_SECURE === "true" || isProduction,
  cookieSameSite: cookieSameSite as "lax" | "none" | "strict",
  ownerEmail: process.env.OWNER_EMAIL ?? "owner@example.com",
  ownerPassword: process.env.OWNER_PASSWORD ?? "Owner123456",
  ownerSkip2fa: process.env.OWNER_BOOTSTRAP_SKIP_2FA !== "false",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Admin123456",
  seedOnBoot: process.env.SEED_ON_BOOT !== "false",
};

export const isProd = env.nodeEnv === "production";
