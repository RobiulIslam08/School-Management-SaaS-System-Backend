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

function toEnDigits(str: string): string {
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return (str || "").replace(/[০-৯]/g, (ch) => bnToEn[ch] ?? ch);
}

function addDobFormats(set: Set<string>, y: number, m: number, d: number) {
  if (!y || !m || !d || Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  const yyyy = String(y);

  // Common date formats (with leading zeroes)
  set.add(`${dd}-${mm}-${yyyy}`); // 01-01-2010
  set.add(`${yyyy}-${mm}-${dd}`); // 2010-01-01
  set.add(`${dd}/${mm}/${yyyy}`); // 01/01/2010
  set.add(`${yyyy}/${mm}/${dd}`); // 2010/01/01
  set.add(`${mm}-${dd}-${yyyy}`); // 01-01-2010
  set.add(`${mm}/${dd}/${yyyy}`); // 01/01/2010
  set.add(`${dd}.${mm}.${yyyy}`); // 01.01.2010
  set.add(`${yyyy}.${mm}.${dd}`); // 2010.01.01

  // Without separators
  set.add(`${dd}${mm}${yyyy}`);   // 01012010
  set.add(`${yyyy}${mm}${dd}`);   // 20100101

  // Single digit day/month
  set.add(`${d}-${m}-${yyyy}`);   // 1-1-2010
  set.add(`${d}/${m}/${yyyy}`);   // 1/1/2010
  set.add(`${m}/${d}/${yyyy}`);   // 1/1/2010
  set.add(`${m}-${d}-${yyyy}`);   // 1-1-2010
  set.add(`${yyyy}-${m}-${d}`);   // 2010-1-1
  set.add(`${yyyy}/${m}/${d}`);   // 2010/1/1
  set.add(`${dd}-${m}-${yyyy}`);  // 01-1-2010
  set.add(`${d}-${mm}-${yyyy}`);  // 1-01-2010
}

function getDobVariations(dob?: Date | string | null): string[] {
  if (!dob) return [];
  const set = new Set<string>();

  // If dob is a string like "2010-01-01" or ISO string
  if (typeof dob === "string") {
    const match = dob.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (match) {
      addDobFormats(set, parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10));
    }
  }

  const date = new Date(dob);
  if (!Number.isNaN(date.getTime())) {
    // 1. Bangladesh Standard Time (UTC+6) - schools in Bangladesh operate in Asia/Dhaka (+06:00)
    // When midnight local time is saved in Mongo, it has 18:00:00.000Z the previous day.
    const bdTime = new Date(date.getTime() + 6 * 60 * 60 * 1000);
    addDobFormats(set, bdTime.getUTCFullYear(), bdTime.getUTCMonth() + 1, bdTime.getUTCDate());

    // 2. Local server time
    addDobFormats(set, date.getFullYear(), date.getMonth() + 1, date.getDate());

    // 3. Raw UTC time
    addDobFormats(set, date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }

  return Array.from(set);
}

export async function loginWithPassword(identifier: string, password: string, ownerOnly: boolean) {
  const cleanId = toEnDigits(identifier || "").trim();
  const normalized = cleanId.toLowerCase();
  const cleanPass = toEnDigits(password || "").trim();

  let user = await User.findOne({
    $or: [
      { email: normalized },
      { email: `${normalized}@student.local` },
      { phone: normalized },
    ],
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
        { studentId: cleanId },
        { studentId: normalized },
        { phone: cleanId },
        { phone: normalized },
        { "guardian.phone": cleanId },
        { "guardian.phone": normalized },
        { "guardian.fatherPhone": cleanId },
        { "guardian.fatherPhone": normalized },
        { "guardian.motherPhone": cleanId },
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
        const dobList = getDobVariations(student.dob);
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
            ...dobList,
            student.birthRegNo?.trim(),
            student.birthRegNo?.slice(-4),
          ].filter(Boolean)
        );

        const matched = allowed.has(cleanPass) || allowed.has(cleanPass.toLowerCase());
        if (!matched && cleanPass !== "") {
          throw new ApiError(
            401,
            "ভুল জন্মতারিখ বা পাসওয়ার্ড। আপনার সঠিক জন্মতারিখ (তারিখ-মাস-বছর) নির্বাচন করুন।"
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

  let match = await bcrypt.compare(cleanPass, user.passwordHash).catch(() => false);
  if (!match && user.linkedStudentId) {
    const student = await Student.findById(user.linkedStudentId);
    if (student) {
      const dobList = getDobVariations(student.dob);
      const fallbacks = new Set(
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
          ...dobList,
          student.birthRegNo?.trim(),
          student.birthRegNo?.slice(-4),
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
