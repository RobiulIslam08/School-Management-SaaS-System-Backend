import type { Response } from "express";
import type { FieldError } from "./ApiError";

export function ok<T>(res: Response, data: T, message: string | null = null, status = 200): void {
  res.status(status).json({ success: true, data, message, errors: null });
}

export function fail(
  res: Response,
  status: number,
  message: string,
  errors: FieldError[] | null = null
): void {
  res.status(status).json({ success: false, data: null, message, errors });
}
