"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEEKDAYS = void 0;
exports.isWeekday = isWeekday;
exports.WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];
function isWeekday(day) {
    return day >= 0 && day <= 6;
}
