import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Error as MongooseError } from "mongoose";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/ApiError";
import { fail } from "../utils/respond";
import { msg } from "../utils/messages";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    fail(res, err.statusCode, err.message, err.errors);
    return;
  }
  if (err instanceof ZodError) {
    fail(
      res,
      400,
      msg.validation,
      err.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }))
    );
    return;
  }
  if (err instanceof MongooseError.CastError) {
    fail(res, 400, msg.invalid("Record", "The id is invalid."));
    return;
  }
  const mongo = err as { code?: number; keyValue?: Record<string, unknown> };
  if (mongo?.code === 11000) {
    const field = Object.keys(mongo.keyValue ?? {})[0] ?? "value";
    fail(res, 409, msg.duplicate("Record", field.charAt(0).toUpperCase() + field.slice(1)));
    return;
  }
  logger.error("Unhandled error", { error: err instanceof Error ? err.message : "unknown" });
  fail(res, 500, msg.server);
}

export function notFound(_req: Request, res: Response): void {
  fail(res, 404, "This API route was not found.");
}
