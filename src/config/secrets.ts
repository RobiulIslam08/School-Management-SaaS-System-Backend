import { createHmac, randomBytes } from "crypto";

/** Stable across serverless isolates when JWT_SECRET is unset but MONGODB_URI is set. */
export function resolveAppSecret(input: {
  envValue: string | undefined;
  name: string;
  isProduction: boolean;
  devFallback: string;
  mongoUri: string;
}): string {
  if (input.envValue) return input.envValue;
  if (!input.isProduction) return input.devFallback;
  if (input.mongoUri) {
    return createHmac("sha256", `school-saas:${input.name}`).update(input.mongoUri).digest("hex");
  }
  return randomBytes(32).toString("hex");
}
