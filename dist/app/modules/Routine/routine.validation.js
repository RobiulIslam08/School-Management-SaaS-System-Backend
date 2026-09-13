"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineSlotValidation = void 0;
const zod_1 = require("zod");
exports.routineSlotValidation = zod_1.z.object({
    classId: zod_1.z.string().min(1),
    section: zod_1.z.string().min(1),
    day: zod_1.z.number().int().min(0).max(6),
    period: zod_1.z.number().int().min(1).max(12),
    subjectId: zod_1.z.string().optional(),
    teacherId: zod_1.z.string().optional(),
});
