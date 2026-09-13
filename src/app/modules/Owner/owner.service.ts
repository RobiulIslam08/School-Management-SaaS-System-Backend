import { FEATURE_LABELS } from "../../../lib/features";
import { FeaturePackage, normalizeModules } from "../../../models/FeaturePackage";
import { writeAudit } from "../../../services/audit.service";
import type { AuthUser } from "../../../types/express";
import { msg } from "../../../utils/messages";

export async function getPackages() {
  const pack = (await FeaturePackage.findOne()) ?? (await FeaturePackage.create({}));
  return { modules: normalizeModules(pack.modules), labels: FEATURE_LABELS };
}

export async function updatePackages(input: Record<string, boolean>, user?: AuthUser) {
  if (!input || Object.keys(input).length === 0) {
    return { modules: (await getPackages()).modules, message: msg.noFields("Feature package") };
  }
  const before = await FeaturePackage.findOne();
  const modules = normalizeModules({ ...normalizeModules(before?.modules), ...input });
  const pack = before ?? (await FeaturePackage.create({ modules }));
  pack.modules = modules as never;
  await pack.save();
  await writeAudit({
    user,
    action: "update_packages",
    entity: "FeaturePackages",
    before: before?.modules,
    after: modules,
  });
  return { modules, message: msg.updated("Feature package") };
}
