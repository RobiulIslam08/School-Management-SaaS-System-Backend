"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const certificate_service_1 = require("./certificate.service");
exports.certificateController = {
    async listTemplates(_req, res) {
        const items = await (0, certificate_service_1.listTemplates)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Certificate templates", items.length));
    },
    async updateTemplate(req, res) {
        const updated = await (0, certificate_service_1.updateTemplate)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Certificate template"));
    },
    async listIssued(req, res) {
        await (0, certificate_service_1.ensureCertificateTemplates)();
        const kind = typeof req.query.kind === "string" ? req.query.kind : undefined;
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const items = await (0, certificate_service_1.listIssued)(kind, classId);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Certificates", items.length));
    },
    async getIssued(req, res) {
        const item = await (0, certificate_service_1.getIssued)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, item, messages_1.msg.loaded("Certificate"));
    },
    async issue(req, res) {
        const created = await (0, certificate_service_1.issueCertificate)(req.body, req.user);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Certificate"), 201);
    },
};
