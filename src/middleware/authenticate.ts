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
    let studentMeta: { studentId?: string; nameBn?: string; rollNo?: string; section?: string; classId?: unknown } = {};
    if (user.linkedStudentId) {
      const { Student } = await import("../models/Student");
      const student = await Student.findById(user.linkedStudentId).populate("classId", "name").lean();
      if (student) {
        studentMeta = {
          studentId: student.studentId,
          nameBn: student.nameBn,
          rollNo: student.rollNo,
          section: student.section,
          classId: student.classId,
        };
      }
    }
    req.user = {
      id: String(user._id),
      role: user.role,
      permissions: effectivePermissions(user.role, user.permissions),
      name: user.name,
      email: user.email,
      ...studentMeta,
    };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session"));
  }
}
