"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const academic_service_1 = require("./academic.service");
exports.academicController = {
    async listClasses(_req, res) {
        const items = await (0, academic_service_1.listClasses)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Classes", items.length));
    },
    async createClass(req, res) {
        const created = await (0, academic_service_1.createClass)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Class"), 201);
    },
    async updateClass(req, res) {
        const updated = await (0, academic_service_1.updateClass)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Class"));
    },
    async listSubjects(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const items = await (0, academic_service_1.listSubjects)(classId);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Subjects", items.length));
    },
    async createSubject(req, res) {
        const created = await (0, academic_service_1.createSubject)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Subject"), 201);
    },
    async updateSubject(req, res) {
        const updated = await (0, academic_service_1.updateSubject)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Subject"));
    },
};
