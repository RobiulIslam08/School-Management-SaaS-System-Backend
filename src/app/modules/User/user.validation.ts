import { z } from "zod";
import { ROLES } from "../../../lib/permissions";

export const createUserValidation = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(ROLES).refine((role) => role !== "platform_owner", "Owner accounts cannot be created here"),
  permissions: z.array(z.string()).optional(),
  phone: z.string().optional(),
});

export const updateUserValidation = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(ROLES).refine((role) => role !== "platform_owner", "Owner accounts cannot be created here").optional(),
});
