"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const routes_1 = require("./app/routes");
const cors_origin_1 = require("./lib/cors-origin");
const vercel_request_1 = require("./lib/vercel-request");
const errorHandler_1 = require("./middleware/errorHandler");
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            const allowed = (0, cors_origin_1.isAllowedOrigin)(origin, env_1.env.frontendOrigin);
            callback(null, allowed);
        },
        credentials: true,
    }));
    app.use((req, res, next) => {
        res.setHeader("Cache-Control", "no-store");
        if ((0, vercel_request_1.hasParsedJsonBody)(req)) {
            next();
            return;
        }
        express_1.default.json({ limit: "2mb" })(req, res, next);
    });
    app.use((0, cookie_parser_1.default)());
    app.use((0, morgan_1.default)(env_1.env.nodeEnv === "development" ? "dev" : "combined"));
    app.get("/", (_req, res) => {
        res.json({
            success: true,
            data: { ok: true, service: "school-api", mongo: Boolean(env_1.env.mongoUri) },
            message: null,
            errors: null,
        });
    });
    app.get("/health", (_req, res) => {
        res.json({
            success: true,
            data: { ok: true, service: "school-api", mongo: Boolean(env_1.env.mongoUri) },
            message: null,
            errors: null,
        });
    });
    app.get("/favicon.ico", (_req, res) => {
        res.status(204).end();
    });
    app.use("/api/v1", routes_1.apiRouter);
    app.use(errorHandler_1.notFound);
    app.use(errorHandler_1.errorHandler);
    return app;
}
