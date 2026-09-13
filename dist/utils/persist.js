"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireId = requireId;
exports.routeParam = routeParam;
exports.requirePayload = requirePayload;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
const ApiError_1 = require("./ApiError");
const messages_1 = require("./messages");
function requireId(id, entity) {
    if (!id) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked(entity, "Record id is missing."));
    }
    return id;
}
function routeParam(value) {
    return Array.isArray(value) ? value[0] : value;
}
function requirePayload(body, entity) {
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noFields(entity));
    }
    return body;
}
async function updateDocument(model, id, body, entity) {
    const recordId = requireId(id, entity);
    const payload = requirePayload(body, entity);
    const existing = await model.findById(recordId);
    if (!existing) {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound(entity));
    }
    existing.set(payload);
    if (!existing.isModified()) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges(entity));
    }
    await existing.save();
    return existing;
}
async function deleteDocument(model, id, entity) {
    const recordId = requireId(id, entity);
    const existing = await model.findByIdAndDelete(recordId);
    if (!existing) {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead(entity));
    }
    return existing;
}
