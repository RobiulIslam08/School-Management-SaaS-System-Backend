"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionValidation = exports.classUpdateValidation = exports.classCreateValidation = void 0;
const zod_1 = require("zod");
const sectionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    capacity: zod_1.z.number().int().min(0).optional(),
    classTeacherId: zod_1.z.string().optional(),
});
exports.classCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Class name is required"),
    code: zod_1.z.string().min(1, "Class code is required"),
    level: zod_1.z.number().int(),
    sortOrder: zod_1.z.number().int().optional(),
    group: zod_1.z.enum(["Science", "Business", "Humanities", "None"]).optional(),
    sections: zod_1.z.array(zod_1.z.union([zod_1.z.string(), sectionSchema])).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.classUpdateValidation = exports.classCreateValidation.partial();
exports.sectionValidation = sectionSchema;
