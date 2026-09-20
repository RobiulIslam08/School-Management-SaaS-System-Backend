import { z } from "zod";

export const staffAttendanceBulkValidation = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  entries: z
    .array(
      z.object({
        teacherId: z.string().regex(/^[a-fA-F0-9]{24}$/),
        status: z.enum(["present", "absent", "late", "leave"]),
        remark: z.string().optional(),
      })
    )
    .min(1, "No attendance entries were sent"),
});
