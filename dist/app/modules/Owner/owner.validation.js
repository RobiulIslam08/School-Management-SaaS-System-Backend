"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerPackageValidation = void 0;
const zod_1 = require("zod");
exports.ownerPackageValidation = zod_1.z.object({
    modules: zod_1.z.record(zod_1.z.string(), zod_1.z.boolean()),
});
