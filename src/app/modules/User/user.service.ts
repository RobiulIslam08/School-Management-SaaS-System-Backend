import bcrypt from "bcryptjs";
import { ROLE_PERMISSIONS, type Role } from "../../../lib/permissions";
import { User } from "../../../models/User";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function listStaff() {
  return User.find({ role: { $ne: "platform_owner" } }).select("-passwordHash -totpSecret");
}

export async function createStaff(body: {
  name: string;
  email: string;
  password: string;
  role: Role;
  permissions?: string[];
  phone?: string;
}) {
  const exists = await User.findOne({ email: body.email.toLowerCase() });
  if (exists) throw new ApiError(409, msg.duplicate("Staff account", "Email"));
  const user = await User.create({
    name: body.name,
    email: body.email.toLowerCase(),
    phone: body.phone,
    passwordHash: await bcrypt.hash(body.password, 10),
    role: body.role,
    permissions: body.permissions ?? ROLE_PERMISSIONS[body.role],
  });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function updateStaff(
  id: string,
  body: { name?: string; phone?: string; permissions?: string[]; isActive?: boolean; password?: string; role?: Role },
  actorId?: string
) {
  if (!id) throw new ApiError(400, msg.updateBlocked("Staff account", "Record id is missing."));
  if (!body || Object.keys(body).length === 0) {
    throw new ApiError(400, msg.noFields("Staff account"));
  }
  const user = await User.findById(id);
  if (!user || user.role === "platform_owner") {
    throw new ApiError(404, msg.notFound("Staff account"));
  }
  if (actorId && actorId === id && (body.isActive === false || body.role)) {
    throw new ApiError(400, msg.updateBlocked("Staff account", "You cannot change your own role or deactivate this account."));
  }
  if (body.password) {
    user.passwordHash = await bcrypt.hash(body.password, 10);
  }
  if (body.role && body.role !== "platform_owner") {
    user.role = body.role;
    if (!body.permissions) {
      user.permissions = ROLE_PERMISSIONS[body.role];
    }
  }
  const { password: _pw, role: _role, ...rest } = body;
  user.set(rest);
  if (!user.isModified()) {
    throw new ApiError(400, msg.noChanges("Staff account"));
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
