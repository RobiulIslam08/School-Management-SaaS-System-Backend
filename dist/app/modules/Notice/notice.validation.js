"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeUpdateValidation = exports.noticeCreateValidation = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");
exports.noticeCreateValidation = zod_1.z
    .object({
    title: zod_1.z.string().min(1, "Notice title is required"),
    body: zod_1.z.string().min(1, "Notice body is required"),
    audience: zod_1.z.enum(["all", "teachers", "students", "guardians", "class"]),
    classId: objectId.optional().or(zod_1.z.literal("")),
    isPublished: zod_1.z.boolean().optional(),
})
    .superRefine((data, ctx) => {
    if (data.audience === "class" && !data.classId) {
        ctx.addIssue({ code: "custom", message: "Class is required for a class notice", path: ["classId"] });
    }
});
exports.noticeUpdateValidation = zod_1.z
    .object({
    title: zod_1.z.string().min(1, "Notice title is required").optional(),
    body: zod_1.z.string().min(1, "Notice body is required").optional(),
    audience: zod_1.z.enum(["all", "teachers", "students", "guardians", "class"]).optional(),
    classId: objectId.optional().or(zod_1.z.literal("")),
    isPublished: zod_1.z.boolean().optional(),
})
    .superRefine((data, ctx) => {
    if (data.audience === "class" && !data.classId) {
        ctx.addIssue({ code: "custom", message: "Class is required for a class notice", path: ["classId"] });
    }
});
