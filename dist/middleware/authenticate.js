"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const permissions_1 = require("../lib/permissions");
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
async function authenticate(req, _res, next) {
    const token = req.cookies?.accessToken;
    if (!token) {
        next(new ApiError_1.ApiError(401, "Authentication required"));
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        const user = await User_1.User.findById(payload.sub);
        if (!user || !user.isActive) {
            next(new ApiError_1.ApiError(401, "Authentication required"));
            return;
        }
        req.user = {
            id: String(user._id),
            role: user.role,
            permissions: user.permissions.length ? user.permissions : permissions_1.ROLE_PERMISSIONS[user.role],
            name: user.name,
            email: user.email,
        };
        next();
    }
    catch {
        next(new ApiError_1.ApiError(401, "Invalid or expired session"));
    }
}
