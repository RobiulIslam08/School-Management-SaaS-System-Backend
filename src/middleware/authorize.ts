import type { NextFunction, Request, Response } from "express";
import { hasPermission, type Permission } from "../lib/permissions";
import { ApiError } from "../utils/ApiError";

export function authorize(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication required"));
      return;
    }
    if (!hasPermission(req.user.role, req.user.permissions, permission)) {
      next(new ApiError(403, "You do not have permission for this action"));
      return;
    }
    next();
  };
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication required"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "Role not allowed"));
      return;
    }
    next();
  };
}
