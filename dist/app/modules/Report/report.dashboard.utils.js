"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthRange = monthRange;
exports.isoDate = isoDate;
exports.trendPct = trendPct;
exports.lastDays = lastDays;
function monthRange(offset = 0, from = new Date()) {
    const start = new Date(from.getFullYear(), from.getMonth() + offset, 1);
    const end = new Date(from.getFullYear(), from.getMonth() + offset + 1, 1);
    return { start, end };
}
function isoDate(value = new Date()) {
    return value.toISOString().slice(0, 10);
}
function trendPct(current, previous) {
    if (previous <= 0)
        return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}
function lastDays(count, from = new Date()) {
    return Array.from({ length: count }, (_, index) => {
        const day = new Date(from);
        day.setDate(from.getDate() - (count - 1 - index));
        return isoDate(day);
    });
}
