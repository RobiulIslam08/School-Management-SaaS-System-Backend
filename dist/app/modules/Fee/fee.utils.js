"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerStatus = ledgerStatus;
function ledgerStatus(dueAmount, paidAmount, discount) {
    const remaining = dueAmount - discount - paidAmount;
    if (remaining <= 0)
        return "paid";
    if (paidAmount > 0)
        return "partial";
    return "due";
}
