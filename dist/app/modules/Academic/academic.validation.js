"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectUpdateValidation = exports.subjectCreateValidation = exports.classUpdateValidation = exports.classCreateValidation = void 0;
const zod_1 = require("zod");
exports.classCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Class name is required"),
    code: zod_1.z.string().min(1, "Class code is required"),
    level: zod_1.z.number().int(),
    group: zod_1.z.enum(["Science", "Business", "Humanities", "None"]).optional(),
    sections: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.classUpdateValidation = exports.classCreateValidation.partial();
exports.subjectCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Subject name is required"),
    code: zod_1.z.string().min(1, "Subject code is required"),
    classId: zod_1.z.string(),
    group: zod_1.z.enum(["Science", "Business", "Humanities", "Common"]).optional(),
    markDistribution: zod_1.z
        .object({
        cq: zod_1.z.number(),
        mcq: zod_1.z.number(),
        practical: zod_1.z.number(),
        attendance: zod_1.z.number(),
    })
        .optional(),
});
exports.subjectUpdateValidation = exports.subjectCreateValidation.partial();
