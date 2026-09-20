import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { effectivePermissions } from "../lib/permissions";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    next(new ApiError(401, "Authentication required"));
    return;
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      next(new ApiError(401, "Authentication required"));
      return;
    }
    req.user = {
      id: String(user._id),
      role: user.role,
      permissions: effectivePermissions(user.role, user.permissions),
      name: user.name,
      email: user.email,
    };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session"));
  }
}
