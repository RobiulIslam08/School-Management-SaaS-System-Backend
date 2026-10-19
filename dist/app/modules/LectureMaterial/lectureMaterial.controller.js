"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lectureMaterialController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const persist_1 = require("../../../utils/persist");
const lectureMaterial_service_1 = require("./lectureMaterial.service");
exports.lectureMaterialController = {
    async list(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
        const teacherId = typeof req.query.teacherId === "string" ? req.query.teacherId : undefined;
        const academicYear = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
        const items = await (0, lectureMaterial_service_1.listLectureMaterials)({ classId, subjectId, teacherId, academicYear });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Lecture materials", items.length));
    },
    async create(req, res) {
        const item = await (0, lectureMaterial_service_1.createLectureMaterial)(req.body);
        (0, respond_1.ok)(res, item, messages_1.msg.saved("Lecture material"), 201);
    },
    async update(req, res) {
        const item = await (0, lectureMaterial_service_1.updateLectureMaterial)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, item, messages_1.msg.updated("Lecture material"));
    },
    async remove(req, res) {
        const result = await (0, lectureMaterial_service_1.deleteLectureMaterial)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Lecture material"));
    },
    async publicList(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
        const items = await (0, lectureMaterial_service_1.listPublicLectureMaterials)(classId, subjectId);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Lecture materials", items.length));
    },
};
