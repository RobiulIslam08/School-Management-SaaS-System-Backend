import type { IncomingMessage, ServerResponse } from "http";
import type { Express } from "express";

let app: Express | null = null;

function publicErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return "Function failed.";
  return error.message.replace(/mongodb(\+srv)?:\/\/\S+/gi, "mongodb://***").slice(0, 240);
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  if (res.headersSent) return;
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const { missingEnv } = await import("../src/config/env");
    const { requestPathname, restoreVercelUrl } = await import("../src/lib/vercel-request");
    const { createApp } = await import("../src/app");
    const { connectDb } = await import("../src/db/connect");
    const { seedOnce } = await import("../src/seeds");

    restoreVercelUrl(req);
    if (missingEnv.length) {
      sendJson(res, 503, {
        success: false,
        data: { missing: missingEnv },
        message: "Set these environment variables on the Vercel backend project, then Redeploy.",
        errors: missingEnv.map((field) => ({ field, message: "Required" })),
      });
      return;
    }

    const pathname = requestPathname(req.url);
    if (pathname !== "/" && pathname !== "/health") {
      await connectDb();
      await seedOnce();
    }

    const server = app ?? createApp();
    app = server;

    await new Promise<void>((resolve, reject) => {
      const done = () => resolve();
      res.once("finish", done);
      res.once("close", done);
      try {
        const maybe = server(req, res) as void | Promise<void>;
        if (maybe && typeof maybe.then === "function") {
          void maybe.catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    sendJson(res, 500, {
      success: false,
      data: null,
      message: publicErrorMessage(error),
      errors: null,
    });
  }
}
