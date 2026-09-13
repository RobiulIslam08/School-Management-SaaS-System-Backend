import { z } from "zod";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");

export const noticeCreateValidation = z
  .object({
    title: z.string().min(1, "Notice title is required"),
    body: z.string().min(1, "Notice body is required"),
    audience: z.enum(["all", "teachers", "students", "guardians", "class"]),
    classId: objectId.optional().or(z.literal("")),
    isPublished: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.audience === "class" && !data.classId) {
      ctx.addIssue({ code: "custom", message: "Class is required for a class notice", path: ["classId"] });
    }
  });

export const noticeUpdateValidation = z
  .object({
    title: z.string().min(1, "Notice title is required").optional(),
    body: z.string().min(1, "Notice body is required").optional(),
    audience: z.enum(["all", "teachers", "students", "guardians", "class"]).optional(),
    classId: objectId.optional().or(z.literal("")),
    isPublished: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.audience === "class" && !data.classId) {
      ctx.addIssue({ code: "custom", message: "Class is required for a class notice", path: ["classId"] });
    }
  });
