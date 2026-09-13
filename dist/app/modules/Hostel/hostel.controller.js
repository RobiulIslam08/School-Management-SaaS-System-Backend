"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostelController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const hostel_service_1 = require("./hostel.service");
exports.hostelController = {
    async list(_req, res) {
        const items = await (0, hostel_service_1.listHostels)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Hostels", items.length));
    },
    async create(req, res) {
        const created = await (0, hostel_service_1.createHostel)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Hostel"), 201);
    },
    async update(req, res) {
        const updated = await (0, hostel_service_1.updateHostel)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Hostel"));
    },
    async remove(req, res) {
        await (0, hostel_service_1.deleteHostel)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, { deleted: true }, messages_1.msg.deleted("Hostel"));
    },
};
