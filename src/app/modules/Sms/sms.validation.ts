import { z } from "zod";

export const smsSendValidation = z.object({
  body: z.string().min(3, "SMS body is too short"),
  template: z.string().optional(),
  audience: z.enum(["all_guardians", "class", "teachers", "custom"]),
  classId: z.string().optional(),
  phones: z.array(z.string()).optional(),
});
