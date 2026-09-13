"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
exports.requireRole = requireRole;
const permissions_1 = require("../lib/permissions");
const ApiError_1 = require("../utils/ApiError");
function authorize(permission) {
    return (req, _res, next) => {
        if (!req.user) {
            next(new ApiError_1.ApiError(401, "Authentication required"));
            return;
        }
        if (!(0, permissions_1.hasPermission)(req.user.role, req.user.permissions, permission)) {
            next(new ApiError_1.ApiError(403, "You do not have permission for this action"));
            return;
        }
        next();
    };
}
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            next(new ApiError_1.ApiError(401, "Authentication required"));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new ApiError_1.ApiError(403, "Role not allowed"));
            return;
        }
        next();
    };
}
