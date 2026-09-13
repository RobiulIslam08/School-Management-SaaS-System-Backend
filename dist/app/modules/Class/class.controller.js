"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const class_service_1 = require("./class.service");
exports.classController = {
    async list(_req, res) {
        const items = await (0, class_service_1.listClasses)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Classes", items.length));
    },
    async create(req, res) {
        const created = await (0, class_service_1.createClass)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Class"), 201);
    },
    async update(req, res) {
        const updated = await (0, class_service_1.updateClass)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Class"));
    },
    async archive(req, res) {
        const updated = await (0, class_service_1.archiveClass)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, updated, messages_1.msg.archived("Class"));
    },
    async remove(req, res) {
        await (0, class_service_1.deleteClass)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, { deleted: true }, messages_1.msg.archived("Class"));
    },
    async workspace(req, res) {
        const data = await (0, class_service_1.classWorkspace)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, data, messages_1.msg.loaded("Class"));
    },
    async saveSection(req, res) {
        const previousName = typeof req.body.previousName === "string" ? req.body.previousName : undefined;
        const updated = await (0, class_service_1.upsertSection)((0, persist_1.routeParam)(req.params.id), req.body, previousName);
        (0, respond_1.ok)(res, updated, messages_1.msg.saved("Section"));
    },
    async deleteSection(req, res) {
        const name = String(req.query.name ?? req.body.name ?? "");
        const updated = await (0, class_service_1.removeSection)((0, persist_1.routeParam)(req.params.id), name);
        (0, respond_1.ok)(res, updated, messages_1.msg.archived("Section"));
    },
};
