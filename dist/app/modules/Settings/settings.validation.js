"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsUpdateValidation = void 0;
const zod_1 = require("zod");
exports.settingsUpdateValidation = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    logoUrl: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    eiin: zod_1.z.string().optional(),
    establishedYear: zod_1.z.number().int().min(1800).max(2100).nullable().optional(),
    motto: zod_1.z.string().optional(),
    theme: zod_1.z.object({ primary: zod_1.z.string().optional(), radius: zod_1.z.string().optional() }).optional(),
    academicYear: zod_1.z.string().optional(),
    smsApiKey: zod_1.z.string().optional(),
    defaultLanguage: zod_1.z.enum(["bn", "en"]).optional(),
});
