"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function getSettings() {
    return (await SchoolSettings_1.SchoolSettings.findOne()) ?? (await SchoolSettings_1.SchoolSettings.create({ name: "Your School" }));
}
async function updateSettings(body, user) {
    if (!body || Object.keys(body).length === 0) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noFields("School settings"));
    }
    const before = await SchoolSettings_1.SchoolSettings.findOne();
    const settings = before ?? (await SchoolSettings_1.SchoolSettings.create({ name: "Your School" }));
    settings.set(body);
    if (!settings.isModified()) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("School settings"));
    }
    await settings.save();
    await (0, audit_service_1.writeAudit)({ user, action: "update", entity: "SchoolSettings", before, after: settings });
    return settings;
}
