"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.env = exports.missingEnv = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const secrets_1 = require("./secrets");
// Vercel injects env in the dashboard. Loading a missing `.env` only logs noise.
if (!process.env.VERCEL) {
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
}
const isProduction = process.env.NODE_ENV === "production";
const DEV_JWT = "dev-access-secret-change-me";
const DEV_REFRESH = "dev-refresh-secret-change-me";
exports.missingEnv = [];
function rememberMissing(name) {
    if (!exports.missingEnv.includes(name))
        exports.missingEnv.push(name);
}
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing required env: ${name}`);
    }
    return value;
}
if (isProduction && !process.env.MONGODB_URI)
    rememberMissing("MONGODB_URI");
const cookieSameSiteRaw = (process.env.COOKIE_SAMESITE ?? "lax").toLowerCase();
const cookieSameSite = cookieSameSiteRaw === "none" || cookieSameSiteRaw === "strict" ? cookieSameSiteRaw : "lax";
exports.env = {
    port: Number(process.env.PORT ?? 4000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    mongoUri: isProduction
        ? (process.env.MONGODB_URI ?? "")
        : required("MONGODB_URI", "mongodb://127.0.0.1:27017/school_management"),
    jwtSecret: (0, secrets_1.resolveAppSecret)({
        envValue: process.env.JWT_SECRET,
        name: "JWT_SECRET",
        isProduction,
        devFallback: DEV_JWT,
        mongoUri: process.env.MONGODB_URI ?? "",
    }),
    jwtRefreshSecret: (0, secrets_1.resolveAppSecret)({
        envValue: process.env.JWT_REFRESH_SECRET,
        name: "JWT_REFRESH_SECRET",
        isProduction,
        devFallback: DEV_REFRESH,
        mongoUri: process.env.MONGODB_URI ?? "",
    }),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? (isProduction ? "" : "http://localhost:3000"),
    publicOrigin: process.env.PUBLIC_ORIGIN ?? (isProduction ? "" : "http://localhost:3001"),
    cookieSecure: process.env.COOKIE_SECURE === "true" || isProduction,
    cookieSameSite: cookieSameSite,
    ownerEmail: process.env.OWNER_EMAIL ?? "owner@example.com",
    ownerPassword: process.env.OWNER_PASSWORD ?? "Owner123456",
    ownerSkip2fa: process.env.OWNER_BOOTSTRAP_SKIP_2FA !== "false",
    adminEmail: process.env.ADMIN_EMAIL ?? "admin@example.com",
    adminPassword: process.env.ADMIN_PASSWORD ?? "Admin123456",
    seedOnBoot: process.env.SEED_ON_BOOT !== "false",
};
exports.isProd = exports.env.nodeEnv === "production";
