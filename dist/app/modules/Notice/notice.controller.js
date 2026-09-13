"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noticeController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const notice_service_1 = require("./notice.service");
exports.noticeController = {
    async list(_req, res) {
        const items = await (0, notice_service_1.listNotices)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Notices", items.length));
    },
    async create(req, res) {
        const created = await (0, notice_service_1.createNotice)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Notice"), 201);
    },
    async update(req, res) {
        const updated = await (0, notice_service_1.updateNotice)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Notice"));
    },
    async remove(req, res) {
        await (0, notice_service_1.deleteNotice)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, { deleted: true }, messages_1.msg.deleted("Notice"));
    },
};
