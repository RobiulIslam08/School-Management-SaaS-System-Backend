"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectTeacherValidation = exports.subjectReorderValidation = exports.subjectUpdateValidation = exports.subjectCreateValidation = void 0;
const zod_1 = require("zod");
const marks = zod_1.z.object({
    cq: zod_1.z.number(),
    mcq: zod_1.z.number(),
    practical: zod_1.z.number(),
    attendance: zod_1.z.number(),
});
exports.subjectCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Subject name is required"),
    code: zod_1.z.string().min(1, "Subject code is required"),
    classId: zod_1.z.string().min(1),
    group: zod_1.z.enum(["Science", "Business", "Humanities", "Common"]).optional(),
    markDistribution: marks.optional(),
    sortOrder: zod_1.z.number().int().optional(),
    compulsory: zod_1.z.boolean().optional(),
    teacherId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.subjectUpdateValidation = exports.subjectCreateValidation.partial();
exports.subjectReorderValidation = zod_1.z.object({
    classId: zod_1.z.string().min(1),
    orderedIds: zod_1.z.array(zod_1.z.string()).min(1),
});
exports.subjectTeacherValidation = zod_1.z.object({
    teacherId: zod_1.z.string().optional(),
});
