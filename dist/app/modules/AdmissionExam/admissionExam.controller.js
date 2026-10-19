"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionExamController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const persist_1 = require("../../../utils/persist");
const admissionExam_service_1 = require("./admissionExam.service");
exports.admissionExamController = {
    async listExams(req, res) {
        const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
        const items = await (0, admissionExam_service_1.listAdmissionExams)(year);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Admission exams", items.length));
    },
    async createExam(req, res) {
        const created = await (0, admissionExam_service_1.createAdmissionExam)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Admission exam"), 201);
    },
    async updateExam(req, res) {
        const updated = await (0, admissionExam_service_1.updateAdmissionExam)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Admission exam"));
    },
    async deleteExam(req, res) {
        const result = await (0, admissionExam_service_1.deleteAdmissionExam)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Admission exam"));
    },
    async publishExam(req, res) {
        const isPublished = Boolean(req.body.isPublished);
        const updated = await (0, admissionExam_service_1.publishAdmissionExam)((0, persist_1.routeParam)(req.params.id), isPublished);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Admission exam status"));
    },
    async listResults(req, res) {
        const examId = (0, persist_1.routeParam)(req.params.examId);
        const results = await (0, admissionExam_service_1.listAdmissionResults)(examId);
        (0, respond_1.ok)(res, results, messages_1.msg.loaded("Admission results", results.length));
    },
    async upsertResult(req, res) {
        const examId = (0, persist_1.routeParam)(req.params.examId);
        const result = await (0, admissionExam_service_1.upsertAdmissionResult)(examId, req.body);
        (0, respond_1.ok)(res, result, messages_1.msg.saved("Admission result"));
    },
    async bulkSaveResults(req, res) {
        const examId = (0, persist_1.routeParam)(req.params.examId);
        const items = Array.isArray(req.body.results) ? req.body.results : [];
        const saved = await (0, admissionExam_service_1.bulkSaveAdmissionResults)(examId, items);
        (0, respond_1.ok)(res, saved, messages_1.msg.saved(`Admission results (${saved.length})`));
    },
    async searchPublic(req, res) {
        const examId = typeof req.query.examId === "string" ? req.query.examId : undefined;
        const roll = typeof req.query.roll === "string" ? req.query.roll : undefined;
        const phone = typeof req.query.phone === "string" ? req.query.phone : undefined;
        const items = await (0, admissionExam_service_1.searchPublicAdmissionResult)({ examId, roll, phone });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Admission results", items.length));
    },
};
