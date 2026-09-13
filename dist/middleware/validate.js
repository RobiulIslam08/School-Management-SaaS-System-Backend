"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const ApiError_1 = require("../utils/ApiError");
const messages_1 = require("../utils/messages");
function validate(schema) {
    return (req, _res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((issue) => ({
                field: issue.path.join(".") || "body",
                message: issue.message,
            }));
            next(new ApiError_1.ApiError(400, messages_1.msg.validation, errors));
            return;
        }
        req.body = parsed.data;
        next();
    };
}
