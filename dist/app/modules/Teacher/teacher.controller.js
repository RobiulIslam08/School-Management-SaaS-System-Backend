"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const teacher_service_1 = require("./teacher.service");
exports.teacherController = {
    async list(req, res) {
        const q = typeof req.query.q === "string" ? req.query.q : "";
        const items = await (0, teacher_service_1.listTeachers)(q);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Teachers", items.length));
    },
    async create(req, res) {
        const created = await (0, teacher_service_1.createTeacher)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Teacher"), 201);
    },
    async update(req, res) {
        const updated = await (0, teacher_service_1.updateTeacher)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Teacher"));
    },
};
