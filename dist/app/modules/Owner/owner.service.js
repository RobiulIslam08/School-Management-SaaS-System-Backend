"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackages = getPackages;
exports.updatePackages = updatePackages;
const features_1 = require("../../../lib/features");
const FeaturePackage_1 = require("../../../models/FeaturePackage");
const audit_service_1 = require("../../../services/audit.service");
const messages_1 = require("../../../utils/messages");
async function getPackages() {
    const pack = (await FeaturePackage_1.FeaturePackage.findOne()) ?? (await FeaturePackage_1.FeaturePackage.create({}));
    return { modules: (0, FeaturePackage_1.normalizeModules)(pack.modules), labels: features_1.FEATURE_LABELS };
}
async function updatePackages(input, user) {
    if (!input || Object.keys(input).length === 0) {
        return { modules: (await getPackages()).modules, message: messages_1.msg.noFields("Feature package") };
    }
    const before = await FeaturePackage_1.FeaturePackage.findOne();
    const modules = (0, FeaturePackage_1.normalizeModules)({ ...(0, FeaturePackage_1.normalizeModules)(before?.modules), ...input });
    const pack = before ?? (await FeaturePackage_1.FeaturePackage.create({ modules }));
    pack.modules = modules;
    await pack.save();
    await (0, audit_service_1.writeAudit)({
        user,
        action: "update_packages",
        entity: "FeaturePackages",
        before: before?.modules,
        after: modules,
    });
    return { modules, message: messages_1.msg.updated("Feature package") };
}
