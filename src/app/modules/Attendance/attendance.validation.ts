import { z } from "zod";

export const attendanceBulkValidation = z.object({
  classId: z.string(),
  section: z.string(),
  date: z.string(),
  entries: z
    .array(
      z.object({
        studentId: z.string(),
        status: z.enum(["present", "absent", "late", "leave"]),
        remark: z.string().optional(),
      })
    )
    .min(1, "No attendance entries were sent"),
});
