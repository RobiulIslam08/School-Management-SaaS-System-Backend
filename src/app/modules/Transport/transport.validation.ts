import { z } from "zod";

export const transportCreateValidation = z.object({
  name: z.string().min(1, "Route name is required"),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  vehicleNo: z.string().optional(),
  stops: z.array(z.string()).optional(),
  fee: z.number().optional(),
});

export const transportUpdateValidation = transportCreateValidation.partial();
