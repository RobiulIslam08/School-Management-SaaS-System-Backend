"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportUpdateValidation = exports.transportCreateValidation = void 0;
const zod_1 = require("zod");
exports.transportCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Route name is required"),
    driverName: zod_1.z.string().optional(),
    driverPhone: zod_1.z.string().optional(),
    vehicleNo: zod_1.z.string().optional(),
    stops: zod_1.z.array(zod_1.z.string()).optional(),
    fee: zod_1.z.number().optional(),
});
exports.transportUpdateValidation = exports.transportCreateValidation.partial();
