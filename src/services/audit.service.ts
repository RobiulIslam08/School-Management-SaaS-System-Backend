import type { AuthUser } from "../types/express";
import { AuditLog } from "../models/AuditLog";

export async function writeAudit(params: {
  user?: AuthUser;
  action: string;
  entity: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  await AuditLog.create({
    userId: params.user?.id,
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    before: params.before ?? null,
    after: params.after ?? null,
  });
}
