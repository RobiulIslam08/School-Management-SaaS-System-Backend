import { SchoolSettings } from "../../../models/SchoolSettings";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function getSettings() {
  return (await SchoolSettings.findOne()) ?? (await SchoolSettings.create({ name: "Your School" }));
}

export async function updateSettings(body: Record<string, unknown>, user?: AuthUser) {
  if (!body || Object.keys(body).length === 0) {
    throw new ApiError(400, msg.noFields("School settings"));
  }
  const before = await SchoolSettings.findOne();
  const settings = before ?? (await SchoolSettings.create({ name: "Your School" }));
  settings.set(body);
  if (!settings.isModified()) {
    throw new ApiError(400, msg.noChanges("School settings"));
  }
  await settings.save();
  await writeAudit({ user, action: "update", entity: "SchoolSettings", before, after: settings });
  return settings;
}
