"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsSendValidation = void 0;
const zod_1 = require("zod");
exports.smsSendValidation = zod_1.z.object({
    body: zod_1.z.string().min(3, "SMS body is too short"),
    template: zod_1.z.string().optional(),
    audience: zod_1.z.enum(["all_guardians", "class", "teachers", "custom"]),
    classId: zod_1.z.string().optional(),
    phones: zod_1.z.array(zod_1.z.string()).optional(),
});
