import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function productionSecret(name: string, fallback: string): string {
  const value = required(name, fallback);
  if (process.env.NODE_ENV === "production" && value === fallback) {
    throw new Error(`${name} must be set to a unique value in production`);
  }
  return value;
}

const cookieSameSiteRaw = (process.env.COOKIE_SAMESITE ?? "lax").toLowerCase();
const cookieSameSite = cookieSameSiteRaw === "none" || cookieSameSiteRaw === "strict" ? cookieSameSiteRaw : "lax";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri:
    process.env.NODE_ENV === "production"
      ? required("MONGODB_URI")
      : required("MONGODB_URI", "mongodb://127.0.0.1:27017/school_management"),
  jwtSecret: productionSecret("JWT_SECRET", "dev-access-secret-change-me"),
  jwtRefreshSecret: productionSecret("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me"),
  frontendOrigin:
    process.env.NODE_ENV === "production"
      ? required("FRONTEND_ORIGIN")
      : (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000"),
  cookieSecure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
  cookieSameSite: cookieSameSite as "lax" | "none" | "strict",
  ownerEmail: process.env.OWNER_EMAIL ?? "owner@example.com",
  ownerPassword: process.env.OWNER_PASSWORD ?? "Owner123456",
  ownerSkip2fa: process.env.OWNER_BOOTSTRAP_SKIP_2FA !== "false",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Admin123456",
  seedOnBoot:
    process.env.NODE_ENV === "production"
      ? process.env.SEED_ON_BOOT === "true"
      : process.env.SEED_ON_BOOT !== "false",
};

export const isProd = env.nodeEnv === "production";
