"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerStatus = void 0;
exports.listStructures = listStructures;
exports.createStructure = createStructure;
exports.listLedgers = listLedgers;
exports.createLedger = createLedger;
exports.addPayment = addPayment;
exports.feeSummary = feeSummary;
exports.archiveLedger = archiveLedger;
const Fee_1 = require("../../../models/Fee");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const fee_utils_1 = require("./fee.utils");
Object.defineProperty(exports, "ledgerStatus", { enumerable: true, get: function () { return fee_utils_1.ledgerStatus; } });
async function listStructures(academicYear) {
    return Fee_1.FeeStructure.find(academicYear ? { academicYear } : {}).populate("classId", "name");
}
async function createStructure(body) {
    return Fee_1.FeeStructure.create(body);
}
async function listLedgers(query) {
    const filter = { deletedAt: null };
    if (query.studentId)
        filter.studentId = query.studentId;
    if (query.status)
        filter.status = query.status;
    return Fee_1.FeeLedger.find(filter).populate("studentId", "name studentId classId").sort({ createdAt: -1 });
}
async function createLedger(body) {
    return Fee_1.FeeLedger.create({
        ...body,
        paidAmount: 0,
        status: (0, fee_utils_1.ledgerStatus)(body.dueAmount, 0, body.discount ?? 0),
    });
}
async function addPayment(ledgerId, payment, user) {
    const id = (0, persist_1.requireId)(ledgerId, "Fee ledger");
    const ledger = await Fee_1.FeeLedger.findById(id);
    if (!ledger || ledger.deletedAt)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Fee ledger"));
    ledger.history.push({ version: ledger.version, paidAmount: ledger.paidAmount, payments: ledger.payments, at: new Date() });
    ledger.payments.push({
        amount: payment.amount,
        method: payment.method,
        refNo: payment.refNo ?? "",
        note: payment.note ?? "",
        date: payment.date ? new Date(payment.date) : new Date(),
    });
    ledger.paidAmount += payment.amount;
    ledger.status = (0, fee_utils_1.ledgerStatus)(ledger.dueAmount, ledger.paidAmount, ledger.discount);
    ledger.version += 1;
    await ledger.save();
    await (0, audit_service_1.writeAudit)({ user, action: "payment", entity: "FeeLedger", entityId: id, after: payment });
    return ledger;
}
async function feeSummary() {
    const ledgers = await Fee_1.FeeLedger.find({ deletedAt: null });
    const due = ledgers.reduce((sum, item) => sum + Math.max(item.dueAmount - item.discount - item.paidAmount, 0), 0);
    const collected = ledgers.reduce((sum, item) => sum + item.paidAmount, 0);
    const byMethod = {};
    ledgers.forEach((ledger) => {
        ledger.payments.forEach((payment) => {
            byMethod[payment.method] = (byMethod[payment.method] ?? 0) + payment.amount;
        });
    });
    return { due, collected, byMethod, count: ledgers.length };
}
async function archiveLedger(id) {
    const recordId = (0, persist_1.requireId)(id, "Fee ledger");
    const ledger = await Fee_1.FeeLedger.findById(recordId);
    if (!ledger)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Fee ledger"));
    if (ledger.deletedAt) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Fee ledger", "It is already archived."));
    }
    ledger.deletedAt = new Date();
    await ledger.save();
    return { id: ledger._id };
}
