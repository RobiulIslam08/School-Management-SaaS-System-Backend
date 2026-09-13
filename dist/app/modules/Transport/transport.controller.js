"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const transport_service_1 = require("./transport.service");
exports.transportController = {
    async list(_req, res) {
        const items = await (0, transport_service_1.listRoutes)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Transport routes", items.length));
    },
    async create(req, res) {
        const created = await (0, transport_service_1.createRoute)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Transport route"), 201);
    },
    async update(req, res) {
        const updated = await (0, transport_service_1.updateRoute)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Transport route"));
    },
    async remove(req, res) {
        await (0, transport_service_1.deleteRoute)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, { deleted: true }, messages_1.msg.deleted("Transport route"));
    },
};
