import type { Role } from "../../../lib/permissions";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
  totpEnabled: boolean;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface TwoFactorBody {
  tempToken: string;
  code: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  email: string;
  code: string;
  password: string;
}

export interface ForgotPasswordResult {
  requested: true;
  delivery: "pending";
  devCode?: string;
}

export interface LoginResult {
  requiresTwoFactor: boolean;
  tempToken: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    permissions: string[];
    totpEnabled: boolean;
    passwordHash: string;
    isActive: boolean;
  } | null;
}
