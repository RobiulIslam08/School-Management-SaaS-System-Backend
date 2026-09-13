"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const payroll_service_1 = require("./payroll.service");
exports.payrollController = {
    async list(_req, res) {
        const items = await (0, payroll_service_1.listPayroll)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Payroll", items.length));
    },
    async create(req, res) {
        const created = await (0, payroll_service_1.createPayroll)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Payslip"), 201);
    },
    async pay(req, res) {
        const item = await (0, payroll_service_1.markPaid)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, item, messages_1.msg.updated("Payslip"));
    },
};
