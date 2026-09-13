import { FeaturePackage, normalizeModules } from "../../../models/FeaturePackage";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export function resolveGuardianStudentId(
  role: string | undefined,
  linkedId: string | undefined,
  queryId?: string
): string {
  if (role === "guardian") {
    return linkedId ? String(linkedId) : "";
  }
  return queryId || (linkedId ? String(linkedId) : "");
}

export async function requirePublicAdmission(): Promise<void> {
  const pack = await FeaturePackage.findOne();
  if (!normalizeModules(pack?.modules).publicAdmission) {
    throw new ApiError(403, msg.featureOff("Public admission"));
  }
}
