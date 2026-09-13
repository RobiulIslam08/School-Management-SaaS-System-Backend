"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceBulkValidation = void 0;
const zod_1 = require("zod");
exports.attendanceBulkValidation = zod_1.z.object({
    classId: zod_1.z.string(),
    section: zod_1.z.string(),
    date: zod_1.z.string(),
    entries: zod_1.z
        .array(zod_1.z.object({
        studentId: zod_1.z.string(),
        status: zod_1.z.enum(["present", "absent", "late", "leave"]),
        remark: zod_1.z.string().optional(),
    }))
        .min(1, "No attendance entries were sent"),
});
