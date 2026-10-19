"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeUpdateValidation = exports.noticeCreateValidation = void 0;
const zod_1 = require("zod");
const Notice_1 = require("../../../models/Notice");
const objectId = zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");
const signatorySchema = zod_1.z.object({
    name: zod_1.z.string().max(120).optional().default(""),
    designation: zod_1.z.string().max(120).optional().default(""),
});
const noticeFields = {
    title: zod_1.z.string().min(1, "Notice title is required").max(200),
    body: zod_1.z.string().min(1, "Notice body is required").max(8000),
    audience: zod_1.z.enum(["all", "teachers", "students", "guardians", "class"]),
    classId: objectId.optional().or(zod_1.z.literal("")),
    isPublished: zod_1.z.boolean().optional(),
    refNo: zod_1.z.string().max(40).optional().or(zod_1.z.literal("")),
    issueDate: zod_1.z.string().optional().or(zod_1.z.literal("")),
    category: zod_1.z.enum(Notice_1.NOTICE_CATEGORIES).optional(),
    signatories: zod_1.z.array(signatorySchema).max(3).optional(),
    showOnWebsite: zod_1.z.boolean().optional(),
    pinned: zod_1.z.boolean().optional(),
};
function requireClassAudience(data, ctx) {
    if (data.audience === "class" && !data.classId) {
        ctx.addIssue({ code: "custom", message: "Class is required for a class notice", path: ["classId"] });
    }
}
exports.noticeCreateValidation = zod_1.z.object(noticeFields).superRefine(requireClassAudience);
exports.noticeUpdateValidation = zod_1.z
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
