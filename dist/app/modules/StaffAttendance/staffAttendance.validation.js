"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffAttendanceBulkValidation = void 0;
const zod_1 = require("zod");
exports.staffAttendanceBulkValidation = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    entries: zod_1.z
        .array(zod_1.z.object({
        teacherId: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/),
        status: zod_1.z.enum(["present", "absent", "late", "leave"]),
        remark: zod_1.z.string().optional(),
    }))
        .min(1, "No attendance entries were sent"),
});
