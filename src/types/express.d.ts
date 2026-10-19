import type { Role } from "../lib/permissions";

export interface AuthUser {
  id: string;
  role: Role;
  permissions: string[];
  name: string;
  email: string;
  studentId?: string;
  nameBn?: string;
  rollNo?: string;
  section?: string;
  classId?: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
