import mongoose, { Schema } from "mongoose";
import { DEFAULT_FEATURES, FEATURE_KEYS, type FeatureKey } from "../lib/features";

export interface FeaturePackageDoc {
  modules: Record<FeatureKey, boolean>;
}

const featureSchema = new Schema<FeaturePackageDoc>(
  {
    modules: {
      type: Schema.Types.Mixed,
      default: () => ({ ...DEFAULT_FEATURES }),
    },
  },
  { timestamps: true, collection: "FeaturePackages" }
);

export const FeaturePackage = mongoose.model<FeaturePackageDoc>("FeaturePackage", featureSchema);

export function normalizeModules(raw: unknown): Record<FeatureKey, boolean> {
  const source = raw && typeof raw === "object" ? (raw as Record<string, boolean>) : {};
  return FEATURE_KEYS.reduce(
    (acc, key) => {
      acc[key] = Boolean(source[key] ?? DEFAULT_FEATURES[key]);
      return acc;
    },
    {} as Record<FeatureKey, boolean>
  );
}
