"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextStaffId = nextStaffId;
async function nextStaffId(count) {
    return `TCH-${String(count + 1).padStart(4, "0")}`;
}
