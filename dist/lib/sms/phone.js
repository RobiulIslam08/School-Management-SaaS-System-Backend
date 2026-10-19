"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBdPhone = normalizeBdPhone;
exports.guardianNotifyPhone = guardianNotifyPhone;
exports.fatherNotifyPhone = fatherNotifyPhone;
/** Normalize Bangladesh mobile numbers to 8801XXXXXXXXX. */
function normalizeBdPhone(raw) {
    if (!raw)
        return null;
    let digits = String(raw).replace(/[^\d+]/g, "");
    if (digits.startsWith("+"))
        digits = digits.slice(1);
    if (digits.startsWith("880") && digits.length === 13)
        return digits;
    if (digits.startsWith("0") && digits.length === 11)
        return `88${digits}`;
    if (digits.length === 10 && digits.startsWith("1"))
        return `880${digits}`;
    if (digits.length === 11 && digits.startsWith("01"))
        return `88${digits}`;
    return null;
}
function guardianNotifyPhone(guardian) {
    return normalizeBdPhone(guardian?.phone) ?? normalizeBdPhone(guardian?.fatherPhone);
}
function fatherNotifyPhone(guardian) {
    return normalizeBdPhone(guardian?.fatherPhone) ?? normalizeBdPhone(guardian?.phone);
}
