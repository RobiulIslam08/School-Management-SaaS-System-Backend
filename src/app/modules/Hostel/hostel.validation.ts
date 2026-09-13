import { z } from "zod";

export const hostelCreateValidation = z.object({
  name: z.string().min(1, "Hostel name is required"),
  type: z.enum(["boys", "girls"]),
  capacity: z.number(),
  occupied: z.number().optional(),
  warden: z.string().optional(),
});

export const hostelUpdateValidation = hostelCreateValidation.partial();
