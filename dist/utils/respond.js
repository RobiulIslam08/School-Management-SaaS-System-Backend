"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.fail = fail;
function ok(res, data, message = null, status = 200) {
    res.status(status).json({ success: true, data, message, errors: null });
}
function fail(res, status, message, errors = null) {
    res.status(status).json({ success: false, data: null, message, errors });
}
