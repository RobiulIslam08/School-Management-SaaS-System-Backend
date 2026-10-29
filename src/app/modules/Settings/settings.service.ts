import { SchoolSettings } from "../../../models/SchoolSettings";
import { WebsiteConfig } from "../../../models/Website";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { invalidatePublicSiteCache } from "../Website/website.service";

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
  if (settings.isModified()) {
    await settings.save();
  }

  // Synchronize theme primary with WebsiteConfig so public website updates instantly
  const themeObj = body.theme as { primary?: string } | undefined;
  const primaryColor = themeObj?.primary || settings.theme?.primary;
  if (primaryColor) {
    await WebsiteConfig.updateMany(
      {},
      { $set: { themePrimary: primaryColor, themePreset: "custom" } }
    );
    await WebsiteConfig.updateOne(
      {},
      { $set: { themePrimary: primaryColor, themePreset: "custom" } },
      { upsert: true }
    );
  }

  // Instantly invalidate public website cache
  invalidatePublicSiteCache();

  await writeAudit({ user, action: "update", entity: "SchoolSettings", before, after: settings });
  return settings;
}
