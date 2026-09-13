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

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/school_management"),
  jwtSecret: required("JWT_SECRET", "dev-access-secret-change-me"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me"),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  ownerEmail: process.env.OWNER_EMAIL ?? "owner@example.com",
  ownerPassword: process.env.OWNER_PASSWORD ?? "Owner123456",
  ownerSkip2fa: process.env.OWNER_BOOTSTRAP_SKIP_2FA !== "false",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Admin123456",
  seedOnBoot: process.env.SEED_ON_BOOT !== "false",
};

export const isProd = env.nodeEnv === "production";
