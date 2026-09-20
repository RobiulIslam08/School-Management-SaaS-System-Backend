import { z } from "zod";
import { NOTICE_CATEGORIES } from "../../../models/Notice";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");

const signatorySchema = z.object({
  name: z.string().max(120).optional().default(""),
  designation: z.string().max(120).optional().default(""),
});

const noticeFields = {
  title: z.string().min(1, "Notice title is required").max(200),
  body: z.string().min(1, "Notice body is required").max(8000),
  audience: z.enum(["all", "teachers", "students", "guardians", "class"]),
  classId: objectId.optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
  refNo: z.string().max(40).optional().or(z.literal("")),
  issueDate: z.string().optional().or(z.literal("")),
  category: z.enum(NOTICE_CATEGORIES).optional(),
  signatories: z.array(signatorySchema).max(3).optional(),
  showOnWebsite: z.boolean().optional(),
  pinned: z.boolean().optional(),
};

function requireClassAudience(
  data: { audience?: string; classId?: string },
  ctx: z.RefinementCtx
) {
  if (data.audience === "class" && !data.classId) {
    ctx.addIssue({ code: "custom", message: "Class is required for a class notice", path: ["classId"] });
  }
}

export const noticeCreateValidation = z.object(noticeFields).superRefine(requireClassAudience);

export const noticeUpdateValidation = z
  .object({
    title: noticeFields.title.optional(),
    body: noticeFields.body.optional(),
    audience: noticeFields.audience.optional(),
    classId: noticeFields.classId,
    isPublished: noticeFields.isPublished,
    refNo: noticeFields.refNo,
    issueDate: noticeFields.issueDate,
    category: noticeFields.category,
    signatories: noticeFields.signatories,
    showOnWebsite: noticeFields.showOnWebsite,
    pinned: noticeFields.pinned,
  })
  .superRefine(requireClassAudience);
