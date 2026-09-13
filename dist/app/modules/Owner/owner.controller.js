"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerController = void 0;
const respond_1 = require("../../../utils/respond");
const messages_1 = require("../../../utils/messages");
const owner_service_1 = require("./owner.service");
exports.ownerController = {
    async getPackages(_req, res) {
        const data = await (0, owner_service_1.getPackages)();
        (0, respond_1.ok)(res, data, messages_1.msg.loaded("Feature packages"));
    },
    async updatePackages(req, res) {
        const result = await (0, owner_service_1.updatePackages)(req.body.modules, req.user);
        (0, respond_1.ok)(res, { modules: result.modules }, result.message);
    },
};
