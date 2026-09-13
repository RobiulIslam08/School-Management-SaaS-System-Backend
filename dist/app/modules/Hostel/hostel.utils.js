"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.occupancyPct = occupancyPct;
exports.canSetOccupied = canSetOccupied;
exports.canDeleteHostel = canDeleteHostel;
function occupancyPct(occupied, capacity) {
    if (capacity <= 0)
        return 0;
    return Math.min(100, Math.round((occupied / capacity) * 100));
}
function canSetOccupied(occupied, capacity) {
    return occupied >= 0 && occupied <= capacity;
}
function canDeleteHostel(occupied) {
    return occupied <= 0;
}
