"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qstr = qstr;
function qstr(value) {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}
