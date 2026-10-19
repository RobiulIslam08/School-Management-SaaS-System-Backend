import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { generateOtpAuthUri, generateSecret, verifyTotp } from "../../../lib/totp";
import { PasswordReset } from "../../../models/PasswordReset";
import { User } from "../../../models/User";
import { Student } from "../../../models/Student";
import { writeAudit } from "../../../services/audit.service";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import type { ForgotPasswordResult } from "./auth.interface";
import {
  generateResetCode,
  isEligibleForPortal,
  isResetExpired,
  RESET_CODE_ROUNDS,
  RESET_COOLDOWN_MS,
  resetAttemptsExceeded,
  resetExpiresAt,
  shouldRevealDevCode,
} from "./auth.utils";

export async function loginWithPassword(identifier: string, password: string, ownerOnly: boolean) {
  const normalized = (identifier || "").toLowerCase().trim();
  let user = await User.findOne({
    $or: [{ email: normalized }, { phone: normalized }],
  });
  let studentMeta: {
    studentId?: string;
    nameBn?: string;
    rollNo?: string;
    section?: string;
    classId?: { _id?: string; name?: string } | null;
  } | undefined;

  if (!user && !ownerOnly) {
    const student = await Student.findOne({
      $or: [
        { studentId: normalized },
        { phone: normalized },
        { "guardian.phone": normalized },
        { "guardian.fatherPhone": normalized },
        { "guardian.motherPhone": normalized },
      ],
      status: { $in: ["active", "alumni", "pending"] },
    }).populate("classId", "name");

    if (student) {
      studentMeta = {
        studentId: student.studentId,
        nameBn: student.nameBn,
        rollNo: student.rollNo,
        section: student.section,
        classId: student.classId as unknown as { _id?: string; name?: string } | null,
      };

      user = await User.findOne({ linkedStudentId: student._id });
      if (!user) {
        // Auto-provision user account for student with friendly default verification
        const cleanPass = password.trim();
        const dobStr = student.dob ? new Date(student.dob).toISOString().slice(0, 10) : "";
        const dobDigits = dobStr.replace(/-/g, "");
        const allowed = new Set(
          [
            "123456",
            "student123",
            "student",
            "password",
            student.rollNo?.trim(),
            student.phone?.trim(),
            student.guardian?.phone?.trim(),
            student.guardian?.fatherPhone?.trim(),
            student.guardian?.motherPhone?.trim(),
            dobStr,
            dobDigits,
            student.birthRegNo?.trim(),
            student.birthRegNo?.slice(-4),
          ].filter(Boolean)
        );

        const matched = allowed.has(cleanPass) || allowed.has(cleanPass.toLowerCase());
        if (!matched && cleanPass !== "") {
          throw new ApiError(
            401,
            "ভুল পাসওয়ার্ড। আপনার নির্ধারিত পাসওয়ার্ড অথবা প্রাথমিক পাসওয়ার্ড (123456 / জন্মতারিখ) ব্যবহার করুন।"
          );
        }

        const initialPassword = cleanPass || "123456";
        const passwordHash = await bcrypt.hash(initialPassword, 10);
        user = await User.create({
          name: student.name,
          email: `${student.studentId.toLowerCase()}@student.local`,
          phone: student.phone || student.guardian?.phone || "",
          passwordHash,
          role: "guardian",
          linkedStudentId: student._id,
          isActive: true,
        });
      }
    }
  }

  if (!user || !user.isActive) {
    throw new ApiError(401, msg.loginFailed);
  }

  // Populate studentMeta if user is linked to a student but studentMeta wasn't set yet
  if (user.linkedStudentId && !studentMeta) {
    const student = await Student.findById(user.linkedStudentId).populate("classId", "name");
    if (student) {
      studentMeta = {
        studentId: student.studentId,
        nameBn: student.nameBn,
        rollNo: student.rollNo,
        section: student.section,
        classId: student.classId as unknown as { _id?: string; name?: string } | null,
      };
    }
  }

  let match = await bcrypt.compare(password, user.passwordHash).catch(() => false);
  if (!match && user.linkedStudentId) {
    const student = await Student.findById(user.linkedStudentId);
    if (student) {
      const cleanPass = password.trim();
      const dobStr = student.dob ? new Date(student.dob).toISOString().slice(0, 10) : "";
      const dobDigits = dobStr.replace(/-/g, "");
      const fallbacks = new Set(
        [
          "123456",
          "student123",
          student.rollNo?.trim(),
          student.phone?.trim(),
          student.guardian?.phone?.trim(),
          student.guardian?.fatherPhone?.trim(),
          student.guardian?.motherPhone?.trim(),
          dobStr,
          dobDigits,
        ].filter(Boolean)
      );

      if (fallbacks.has(cleanPass) || fallbacks.has(cleanPass.toLowerCase())) {
        match = true;
        user.passwordHash = await bcrypt.hash(cleanPass, 10);
        await user.save();
      }
    }
  }

  if (!match) {
    throw new ApiError(401, msg.loginFailed);
  }
  if (ownerOnly && user.role !== "platform_owner") {
    throw new ApiError(403, "Owner portal sign-in failed. This account is not a platform owner.");
  }
  if (!ownerOnly && user.role === "platform_owner") {
    throw new ApiError(403, "Sign-in was blocked. Platform owners must use the owner portal.");
  }

  const needs2fa = user.role === "platform_owner" && user.totpEnabled && !env.ownerSkip2fa;
  if (needs2fa) {
    const tempToken = jwt.sign({ sub: user.id, step: "2fa" }, env.jwtSecret, { expiresIn: "5m" });
    return { requiresTwoFactor: true, tempToken, user: null, studentMeta };
  }

  return { requiresTwoFactor: false, tempToken: null, user, studentMeta };
}

export async function verifyOwnerTotp(tempToken: string, code: string) {
  let payload: { sub: string; step?: string };
  try {
    payload = jwt.verify(tempToken, env.jwtSecret) as { sub: string; step?: string };
  } catch {
    throw new ApiError(401, "Two-factor session expired. Sign in again.");
  }
  if (payload.step !== "2fa") {
    throw new ApiError(401, "Two-factor session is invalid. Sign in again.");
  }
  const user = await User.findById(payload.sub);
  if (!user?.totpSecret) {
    throw new ApiError(400, "Two-factor was not saved for this owner account.");
  }
  const valid = verifyTotp(user.totpSecret, code);
  if (!valid) {
    throw new ApiError(401, "Authenticator code is incorrect. Sign-in was not completed.");
  }
  return user;
}

export async function setupOwnerTotp(userId: string) {
  const user = await User.findById(userId);
  if (!user || user.role !== "platform_owner") {
    throw new ApiError(403, "Two-factor was not saved. Only the platform owner can enable it.");
  }
  const secret = generateSecret();
  user.totpSecret = secret;
  user.totpEnabled = true;
  await user.save();
  const otpauth = generateOtpAuthUri({ issuer: "SchoolSaaS Owner", label: user.email, secret });
  return { secret, otpauth };
}

export async function refreshSession(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as { sub: string };
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new ApiError(401, msg.sessionExpired);
    }
    return user;
  } catch {
    throw new ApiError(401, msg.sessionExpired);
  }
}

export async function getSessionPayload() {
  const { FeaturePackage, normalizeModules } = await import("../../../models/FeaturePackage");
  const { SchoolSettings } = await import("../../../models/SchoolSettings");
  const [settings, pack] = await Promise.all([SchoolSettings.findOne(), FeaturePackage.findOne()]);
  return { settings, features: normalizeModules(pack?.modules) };
}

export async function requestPasswordReset(emailRaw: string, ownerPortal: boolean): Promise<ForgotPasswordResult> {
  const email = emailRaw.toLowerCase().trim();
  const generic: ForgotPasswordResult = { requested: true, delivery: "pending" };

  const user = await User.findOne({ email, isActive: true });
  const eligible = !!user && isEligibleForPortal(user.role, ownerPortal);

  if (!eligible) {
    await bcrypt.hash("000000", RESET_CODE_ROUNDS);
    return generic;
  }

  const recent = await PasswordReset.findOne({
    email,
    ownerPortal,
    consumedAt: null,
    createdAt: { $gte: new Date(Date.now() - RESET_COOLDOWN_MS) },
  });
  if (recent) {
    return generic;
  }

  await PasswordReset.updateMany({ email, ownerPortal, consumedAt: null }, { $set: { consumedAt: new Date() } });

  const code = generateResetCode();
  await PasswordReset.create({
    email,
    codeHash: await bcrypt.hash(code, RESET_CODE_ROUNDS),
    expiresAt: resetExpiresAt(),
    attemptCount: 0,
    ownerPortal,
  });

  if (shouldRevealDevCode()) {
    return { ...generic, devCode: code };
  }
  return generic;
}

export async function resetPasswordWithCode(params: {
  email: string;
  code: string;
  password: string;
  ownerPortal: boolean;
}): Promise<void> {
  const email = params.email.toLowerCase().trim();
  const reset = await PasswordReset.findOne({
    email,
    ownerPortal: params.ownerPortal,
    consumedAt: null,
  }).sort({ createdAt: -1 });

  if (!reset || isResetExpired(reset.expiresAt)) {
    throw new ApiError(400, msg.resetInvalid);
  }
  if (resetAttemptsExceeded(reset.attemptCount)) {
    reset.consumedAt = new Date();
    await reset.save();
    throw new ApiError(400, msg.resetTooMany);
  }

  const match = await bcrypt.compare(params.code, reset.codeHash).catch(() => false);
  if (!match) {
    reset.attemptCount += 1;
    if (resetAttemptsExceeded(reset.attemptCount)) {
      reset.consumedAt = new Date();
      await reset.save();
      throw new ApiError(400, msg.resetTooMany);
    }
    await reset.save();
    throw new ApiError(400, msg.resetInvalid);
  }

  const user = await User.findOne({ email, isActive: true });
  if (!user || !isEligibleForPortal(user.role, params.ownerPortal)) {
    throw new ApiError(400, msg.resetInvalid);
  }

  user.passwordHash = await bcrypt.hash(params.password, 10);
  await user.save();
  reset.consumedAt = new Date();
  await reset.save();
  await PasswordReset.updateMany({ email, consumedAt: null }, { $set: { consumedAt: new Date() } });
  await writeAudit({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
    action: "password_reset",
    entity: "User",
    entityId: String(user._id),
  });
}
