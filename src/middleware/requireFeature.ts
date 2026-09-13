import type { NextFunction, Request, Response } from "express";
import { FEATURE_LABELS, type FeatureKey } from "../lib/features";
import { FeaturePackage, normalizeModules } from "../models/FeaturePackage";
import { ApiError } from "../utils/ApiError";
import { msg } from "../utils/messages";

export function requireFeature(key: FeatureKey) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.role === "platform_owner") {
        next();
        return;
      }
      const pack = await FeaturePackage.findOne().lean();
      const enabled = normalizeModules(pack?.modules)[key];
      if (!enabled) {
        next(new ApiError(403, msg.featureOff(FEATURE_LABELS[key])));
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
