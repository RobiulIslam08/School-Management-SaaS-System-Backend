"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFound = notFound;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
const respond_1 = require("../utils/respond");
const messages_1 = require("../utils/messages");
function errorHandler(err, _req, res, _next) {
    if (err instanceof ApiError_1.ApiError) {
        (0, respond_1.fail)(res, err.statusCode, err.message, err.errors);
        return;
    }
    if (err instanceof zod_1.ZodError) {
        (0, respond_1.fail)(res, 400, messages_1.msg.validation, err.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })));
        return;
    }
    if (err instanceof mongoose_1.Error.CastError) {
        (0, respond_1.fail)(res, 400, messages_1.msg.invalid("Record", "The id is invalid."));
        return;
    }
    const mongo = err;
    if (mongo?.code === 11000) {
        const field = Object.keys(mongo.keyValue ?? {})[0] ?? "value";
        (0, respond_1.fail)(res, 409, messages_1.msg.duplicate("Record", field.charAt(0).toUpperCase() + field.slice(1)));
        return;
    }
    logger_1.logger.error("Unhandled error", { error: err instanceof Error ? err.message : "unknown" });
    (0, respond_1.fail)(res, 500, messages_1.msg.server);
}
function notFound(_req, res) {
    (0, respond_1.fail)(res, 404, "This API route was not found.");
}
