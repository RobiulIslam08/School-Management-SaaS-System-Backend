import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiRouter } from "./app/routes";
import { hasParsedJsonBody } from "./lib/vercel-request";
import { errorHandler, notFound } from "./middleware/errorHandler";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: env.frontendOrigin,
      credentials: true,
    })
  );
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    if (hasParsedJsonBody(req)) {
      next();
      return;
    }
    express.json({ limit: "2mb" })(req, res, next);
  });
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

  app.get("/", (_req, res) => {
    res.json({ success: true, data: { ok: true, service: "school-api" }, message: null, errors: null });
  });
  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { ok: true, service: "school-api" }, message: null, errors: null });
  });

  app.use("/api/v1", apiRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
