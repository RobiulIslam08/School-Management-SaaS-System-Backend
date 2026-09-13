import type { Model } from "mongoose";
import { ApiError } from "./ApiError";
import { msg } from "./messages";

export function requireId(id: string | undefined, entity: string): string {
  if (!id) {
    throw new ApiError(400, msg.updateBlocked(entity, "Record id is missing."));
  }
  return id;
}

export function routeParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function requirePayload(body: unknown, entity: string): Record<string, unknown> {
  if (!body || typeof body !== "object" || Object.keys(body as object).length === 0) {
    throw new ApiError(400, msg.noFields(entity));
  }
  return body as Record<string, unknown>;
}

export async function updateDocument<T>(
  model: Model<T>,
  id: string | undefined,
  body: unknown,
  entity: string
): Promise<T> {
  const recordId = requireId(id, entity);
  const payload = requirePayload(body, entity);
  const existing = await model.findById(recordId);
  if (!existing) {
    throw new ApiError(404, msg.notFound(entity));
  }
  existing.set(payload);
  if (!existing.isModified()) {
    throw new ApiError(400, msg.noChanges(entity));
  }
  await existing.save();
  return existing;
}

export async function deleteDocument<T>(
  model: Model<T>,
  id: string | undefined,
  entity: string
): Promise<T> {
  const recordId = requireId(id, entity);
  const existing = await model.findByIdAndDelete(recordId);
  if (!existing) {
    throw new ApiError(404, msg.notFoundRead(entity));
  }
  return existing;
}
