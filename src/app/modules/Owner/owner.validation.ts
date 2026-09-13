import { z } from "zod";

export const ownerPackageValidation = z.object({
  modules: z.record(z.string(), z.boolean()),
});

export interface OwnerPackagePayload {
  modules: Record<string, boolean>;
}
