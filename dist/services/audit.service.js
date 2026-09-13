"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeAudit = writeAudit;
const AuditLog_1 = require("../models/AuditLog");
async function writeAudit(params) {
    await AuditLog_1.AuditLog.create({
        userId: params.user?.id,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        before: params.before ?? null,
        after: params.after ?? null,
    });
}
