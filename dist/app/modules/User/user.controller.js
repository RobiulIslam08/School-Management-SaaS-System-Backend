"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const user_service_1 = require("./user.service");
exports.userController = {
    async list(_req, res) {
        const users = await (0, user_service_1.listStaff)();
        (0, respond_1.ok)(res, users, messages_1.msg.loaded("Staff accounts", users.length));
    },
    async create(req, res) {
        const user = await (0, user_service_1.createStaff)(req.body);
        (0, respond_1.ok)(res, user, messages_1.msg.saved("Staff account"), 201);
    },
    async update(req, res) {
        const user = await (0, user_service_1.updateStaff)((0, persist_1.routeParam)(req.params.id) ?? "", req.body, req.user?.id);
        (0, respond_1.ok)(res, user, messages_1.msg.updated("Staff account"));
    },
};
