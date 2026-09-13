"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const student_service_1 = require("./student.service");
exports.studentController = {
    async list(req, res) {
        const items = await (0, student_service_1.listStudents)(req.query);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Students", items.length));
    },
    async get(req, res) {
        const item = await (0, student_service_1.getStudent)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, item, messages_1.msg.loaded("Student"));
    },
    async create(req, res) {
        const created = await (0, student_service_1.createStudent)(req.body, req.user);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Student"), 201);
    },
    async update(req, res) {
        const updated = await (0, student_service_1.updateStudent)((0, persist_1.routeParam)(req.params.id), req.body, req.user);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Student"));
    },
    async promote(req, res) {
        const result = await (0, student_service_1.promoteStudents)(req.body.ids, req.body.targetClassId, req.body.targetSection, req.user);
        (0, respond_1.ok)(res, result, messages_1.msg.updated("Student promotion"));
    },
};
