"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAppSecret = resolveAppSecret;
const crypto_1 = require("crypto");
/** Stable across serverless isolates when JWT_SECRET is unset but MONGODB_URI is set. */
function resolveAppSecret(input) {
    if (input.envValue)
        return input.envValue;
    if (!input.isProduction)
        return input.devFallback;
    if (input.mongoUri) {
        return (0, crypto_1.createHmac)("sha256", `school-saas:${input.name}`).update(input.mongoUri).digest("hex");
    }
    return (0, crypto_1.randomBytes)(32).toString("hex");
}
