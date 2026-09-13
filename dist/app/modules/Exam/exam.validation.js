"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultSaveValidation = exports.gradingRuleValidation = exports.examCreateValidation = void 0;
const zod_1 = require("zod");
exports.examCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Exam name is required"),
    code: zod_1.z.string().min(1, "Exam code is required"),
    weight: zod_1.z.number().min(0).max(100).optional().default(0),
    academicYear: zod_1.z.string(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
exports.gradingRuleValidation = zod_1.z.object({
    name: zod_1.z.string(),
    academicYear: zod_1.z.string(),
    scale: zod_1.z.enum(["gpa5", "letter", "percentage"]),
    weights: zod_1.z.array(zod_1.z.object({ examTypeId: zod_1.z.string(), weight: zod_1.z.number() })),
    tieBreak: zod_1.z.array(zod_1.z.enum(["totalMarks", "gpa", "cq", "attendance"])).optional(),
    isDefault: zod_1.z.boolean().optional(),
    classId: zod_1.z.string().optional(),
});
exports.resultSaveValidation = zod_1.z.object({
    studentId: zod_1.z.string(),
    examTypeId: zod_1.z.string(),
    subjectMarks: zod_1.z.array(zod_1.z.object({
        subjectId: zod_1.z.string(),
        cq: zod_1.z.number(),
        mcq: zod_1.z.number(),
        practical: zod_1.z.number(),
        attendance: zod_1.z.number(),
    })),
});
