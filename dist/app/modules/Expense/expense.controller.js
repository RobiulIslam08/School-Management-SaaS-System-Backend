"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const expense_service_1 = require("./expense.service");
exports.expenseController = {
    async list(req, res) {
        const items = await (0, expense_service_1.listExpenses)({
            year: typeof req.query.year === "string" ? req.query.year : undefined,
            month: typeof req.query.month === "string" ? req.query.month : undefined,
            category: typeof req.query.category === "string" ? req.query.category : undefined,
            q: typeof req.query.q === "string" ? req.query.q : undefined,
            from: typeof req.query.from === "string" ? req.query.from : undefined,
            to: typeof req.query.to === "string" ? req.query.to : undefined,
        });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Expenses", items.length));
    },
    async summary(req, res) {
        (0, respond_1.ok)(res, await (0, expense_service_1.expenseSummary)({
            year: typeof req.query.year === "string" ? req.query.year : undefined,
            month: typeof req.query.month === "string" ? req.query.month : undefined,
        }), messages_1.msg.loaded("Expense summary"));
    },
    async create(req, res) {
        (0, respond_1.ok)(res, await (0, expense_service_1.createExpense)(req.body, req.user), messages_1.msg.saved("Expense"), 201);
    },
    async update(req, res) {
        (0, respond_1.ok)(res, await (0, expense_service_1.updateExpense)((0, persist_1.routeParam)(req.params.id), req.body), messages_1.msg.updated("Expense"));
    },
    async remove(req, res) {
        (0, respond_1.ok)(res, await (0, expense_service_1.deleteExpense)((0, persist_1.routeParam)(req.params.id)), messages_1.msg.deleted("Expense"));
    },
};
