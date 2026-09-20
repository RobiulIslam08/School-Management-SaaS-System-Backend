import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { missingEnv, env } from "./config/env";
import { apiRouter } from "./app/routes";
import { connectDb } from "./db/connect";
import { isAllowedOrigin } from "./lib/cors-origin";
import { hasParsedJsonBody } from "./lib/vercel-request";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { seedOnce } from "./seeds";

function isPublicPath(path: string): boolean {
  return path === "/" || path === "/health" || path === "/favicon.ico" || path === "/favicon.png";
}

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    void (async () => {
      try {
        if (missingEnv.length && !isPublicPath(req.path)) {
          res.status(503).json({
            success: false,
            data: { missing: missingEnv },
            message: "Set MONGODB_URI on the Vercel backend project, then Redeploy.",
            errors: missingEnv.map((field) => ({ field, message: "Required" })),
          });
          return;
        }
        if (!isPublicPath(req.path)) {
          await connectDb();
          await seedOnce();
        }
        next();
      } catch (error) {
        next(error);
      }
    })();
  });
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = isAllowedOrigin(origin, env.frontendOrigin);
        callback(null, allowed);
      },
      credentials: true,
    })
  );
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    if (hasParsedJsonBody(req)) {
      next();
      return;
    }
    express.json({ limit: "15mb" })(req, res, next);
  });
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      data: { ok: true, service: "school-api", mongo: Boolean(env.mongoUri) },
      message: null,
      errors: null,
    });
  });
  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      data: { ok: true, service: "school-api", mongo: Boolean(env.mongoUri) },
      message: null,
      errors: null,
    });
  });
  app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });
  app.get("/favicon.png", (_req, res) => {
    res.status(204).end();
  });

  app.use("/api/v1", apiRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

const app = createApp();
export default app;
