"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const subject_service_1 = require("./subject.service");
exports.subjectController = {
    async list(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const items = await (0, subject_service_1.listSubjects)(classId);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Subjects", items.length));
    },
    async create(req, res) {
        const created = await (0, subject_service_1.createSubject)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Subject"), 201);
    },
    async update(req, res) {
        const updated = await (0, subject_service_1.updateSubject)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Subject"));
    },
    async remove(req, res) {
        await (0, subject_service_1.deleteSubject)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, { deleted: true }, messages_1.msg.archived("Subject"));
    },
    async reorder(req, res) {
        const items = await (0, subject_service_1.reorderSubjects)(req.body.classId, req.body.orderedIds);
        (0, respond_1.ok)(res, items, messages_1.msg.updated("Subject order"));
    },
    async teacher(req, res) {
        const updated = await (0, subject_service_1.assignTeacher)((0, persist_1.routeParam)(req.params.id), req.body.teacherId);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Subject teacher"));
    },
};
