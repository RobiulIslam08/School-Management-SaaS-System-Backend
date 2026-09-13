"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const settings_service_1 = require("./settings.service");
exports.settingsController = {
    async get(_req, res) {
        (0, respond_1.ok)(res, await (0, settings_service_1.getSettings)(), messages_1.msg.loaded("School settings"));
    },
    async update(req, res) {
        const settings = await (0, settings_service_1.updateSettings)(req.body, req.user);
        (0, respond_1.ok)(res, settings, messages_1.msg.updated("School settings"));
    },
};
