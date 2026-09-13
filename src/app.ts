import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiRouter } from "./app/routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

export function createApp() {
  const app = express();
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
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { ok: true }, message: null, errors: null });
  });

  app.use("/api/v1", apiRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
