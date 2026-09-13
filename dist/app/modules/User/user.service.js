"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStaff = listStaff;
exports.createStaff = createStaff;
exports.updateStaff = updateStaff;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const permissions_1 = require("../../../lib/permissions");
const User_1 = require("../../../models/User");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function listStaff() {
    return User_1.User.find({ role: { $ne: "platform_owner" } }).select("-passwordHash -totpSecret");
}
async function createStaff(body) {
    const exists = await User_1.User.findOne({ email: body.email.toLowerCase() });
    if (exists)
        throw new ApiError_1.ApiError(409, messages_1.msg.duplicate("Staff account", "Email"));
    const user = await User_1.User.create({
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone,
        passwordHash: await bcryptjs_1.default.hash(body.password, 10),
        role: body.role,
        permissions: body.permissions ?? permissions_1.ROLE_PERMISSIONS[body.role],
    });
    return { id: user._id, name: user.name, email: user.email, role: user.role };
}
async function updateStaff(id, body, actorId) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Staff account", "Record id is missing."));
    if (!body || Object.keys(body).length === 0) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noFields("Staff account"));
    }
    const user = await User_1.User.findById(id);
    if (!user || user.role === "platform_owner") {
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Staff account"));
    }
    if (actorId && actorId === id && (body.isActive === false || body.role)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Staff account", "You cannot change your own role or deactivate this account."));
    }
    if (body.password) {
        user.passwordHash = await bcryptjs_1.default.hash(body.password, 10);
    }
    if (body.role && body.role !== "platform_owner") {
        user.role = body.role;
        if (!body.permissions) {
            user.permissions = permissions_1.ROLE_PERMISSIONS[body.role];
        }
    }
    const { password: _pw, role: _role, ...rest } = body;
    user.set(rest);
    if (!user.isModified()) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Staff account"));
    }
    await user.save();
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
    };
}
