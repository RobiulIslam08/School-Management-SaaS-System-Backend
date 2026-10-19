"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listExpenses = listExpenses;
exports.expenseSummary = expenseSummary;
exports.createExpense = createExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
const Accounts_1 = require("../../../models/Accounts");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
function monthRange(year, month) {
    if (month && /^\d{2}$/.test(month)) {
        const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
        const end = new Date(start);
        end.setUTCMonth(end.getUTCMonth() + 1);
        return { start, end };
    }
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
    return { start, end };
}
async function listExpenses(query) {
    const filter = { deletedAt: null };
    if (query.category)
        filter.category = query.category;
    if (query.from || query.to || query.year) {
        const range = {};
        if (query.from)
            range.$gte = new Date(`${query.from}T00:00:00.000Z`);
        if (query.to) {
            const end = new Date(`${query.to}T00:00:00.000Z`);
            end.setUTCDate(end.getUTCDate() + 1);
            range.$lt = end;
        }
        if (query.year && !query.from && !query.to) {
            const { start, end } = monthRange(query.year, query.month);
            range.$gte = start;
            range.$lt = end;
        }
        filter.date = range;
    }
    if (query.q?.trim()) {
        const q = query.q.trim();
        filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { vendor: { $regex: q, $options: "i" } },
            { paidByName: { $regex: q, $options: "i" } },
            { refNo: { $regex: q, $options: "i" } },
        ];
    }
    return Accounts_1.Expense.find(filter).sort({ date: -1, createdAt: -1 });
}
async function expenseSummary(query) {
    const year = query.year || String(new Date().getFullYear());
    const { start, end } = monthRange(year, query.month);
    const items = await Accounts_1.Expense.find({ deletedAt: null, date: { $gte: start, $lt: end } });
    const byCategory = {};
    for (const key of Accounts_1.EXPENSE_CATEGORIES)
        byCategory[key] = 0;
    let total = 0;
    for (const item of items) {
        total += item.amount;
        byCategory[item.category] = (byCategory[item.category] ?? 0) + item.amount;
    }
    return { total, count: items.length, byCategory, year, month: query.month ?? "" };
}
async function createExpense(body, user) {
    const settings = await SchoolSettings_1.SchoolSettings.findOne().select("academicYear");
    return Accounts_1.Expense.create({
        date: new Date(body.date),
        amount: body.amount,
        category: (body.category ?? "other"),
        title: body.title,
        note: body.note ?? "",
        paidVia: (body.paidVia ?? "Cash"),
        paidByName: body.paidByName ?? "",
        vendor: body.vendor ?? "",
        refNo: body.refNo ?? "",
        academicYear: body.academicYear || settings?.academicYear || "",
        createdByName: user?.name ?? "",
    });
}
async function updateExpense(id, body) {
    const recordId = (0, persist_1.requireId)(id, "Expense");
    const item = await Accounts_1.Expense.findOne({ _id: recordId, deletedAt: null });
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Expense"));
    if (body.date !== undefined)
        item.date = new Date(String(body.date));
    if (body.amount !== undefined)
        item.amount = Number(body.amount);
    if (body.category !== undefined)
        item.category = String(body.category);
    if (body.title !== undefined)
        item.title = String(body.title);
    if (body.note !== undefined)
        item.note = String(body.note);
    if (body.paidVia !== undefined)
        item.paidVia = String(body.paidVia);
    if (body.paidByName !== undefined)
        item.paidByName = String(body.paidByName);
    if (body.vendor !== undefined)
        item.vendor = String(body.vendor);
    if (body.refNo !== undefined)
        item.refNo = String(body.refNo);
    if (body.academicYear !== undefined)
        item.academicYear = String(body.academicYear);
    if (!item.isModified())
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Expense"));
    await item.save();
    return item;
}
async function deleteExpense(id) {
    const recordId = (0, persist_1.requireId)(id, "Expense");
    const item = await Accounts_1.Expense.findOne({ _id: recordId, deletedAt: null });
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Expense"));
    item.deletedAt = new Date();
    await item.save();
    return { deleted: true };
}
