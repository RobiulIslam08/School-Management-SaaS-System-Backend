"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGuardianStudentId = resolveGuardianStudentId;
exports.requirePublicAdmission = requirePublicAdmission;
const FeaturePackage_1 = require("../../../models/FeaturePackage");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
function resolveGuardianStudentId(role, linkedId, queryId) {
    if (role === "guardian") {
        return linkedId ? String(linkedId) : "";
    }
    return queryId || (linkedId ? String(linkedId) : "");
}
async function requirePublicAdmission() {
    const pack = await FeaturePackage_1.FeaturePackage.findOne();
    if (!(0, FeaturePackage_1.normalizeModules)(pack?.modules).publicAdmission) {
        throw new ApiError_1.ApiError(403, messages_1.msg.featureOff("Public admission"));
    }
}
