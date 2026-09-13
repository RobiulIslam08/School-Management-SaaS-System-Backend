"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostelUpdateValidation = exports.hostelCreateValidation = void 0;
const zod_1 = require("zod");
exports.hostelCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Hostel name is required"),
    type: zod_1.z.enum(["boys", "girls"]),
    capacity: zod_1.z.number(),
    occupied: zod_1.z.number().optional(),
    warden: zod_1.z.string().optional(),
});
exports.hostelUpdateValidation = exports.hostelCreateValidation.partial();
