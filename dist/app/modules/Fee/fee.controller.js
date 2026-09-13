"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feeController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const fee_service_1 = require("./fee.service");
exports.feeController = {
    async listStructures(req, res) {
        const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
        const items = await (0, fee_service_1.listStructures)(year);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Fee structures", items.length));
    },
    async createStructure(req, res) {
        const created = await (0, fee_service_1.createStructure)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Fee structure"), 201);
    },
    async listLedgers(req, res) {
        const items = await (0, fee_service_1.listLedgers)(req.query);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Fee ledgers", items.length));
    },
    async createLedger(req, res) {
        const created = await (0, fee_service_1.createLedger)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Fee due"), 201);
    },
    async pay(req, res) {
        const ledger = await (0, fee_service_1.addPayment)((0, persist_1.routeParam)(req.params.id), req.body, req.user);
        (0, respond_1.ok)(res, ledger, messages_1.msg.saved("Payment"));
    },
    async summary(_req, res) {
        (0, respond_1.ok)(res, await (0, fee_service_1.feeSummary)(), messages_1.msg.loaded("Fee summary"));
    },
    async archive(req, res) {
        const data = await (0, fee_service_1.archiveLedger)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, data, messages_1.msg.archived("Fee ledger"));
    },
};
