import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { DEFAULT_FEATURES } from "../lib/features";
import type { Role } from "../lib/permissions";
import { ClassStructure } from "../models/ClassStructure";
import { FeaturePackage, normalizeModules } from "../models/FeaturePackage";
import { SchoolSettings } from "../models/SchoolSettings";
import { Subject } from "../models/Subject";
import { User } from "../models/User";
import { ensureCertificateTemplates } from "../app/modules/Certificate/certificate.service";
import { logger } from "../utils/logger";
import { BUSINESS, COMMON_SUBJECTS, DEFAULT_CLASSES, HUMANITIES, JUNIOR_EXTRA, MASTER_SUBJECT_CATALOG, SCIENCE } from "./nctb";

const DEMO_STAFF = [
  { email: "teacher@example.com", name: "Demo Teacher", role: "teacher" as Role, password: "Teacher123456" },
  { email: "accounts@example.com", name: "Demo Accountant", role: "accountant" as Role, password: "Accounts123456" },
];

async function upsertUser(params: {
  email: string;
  name: string;
  role: Role;
  password: string;
}): Promise<void> {
  const email = params.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) return;
  await User.create({
    email,
    name: params.name,
    passwordHash: await bcrypt.hash(params.password, 10),
    role: params.role,
    permissions: [],
    isActive: true,
    totpEnabled: false,
  });
}

let seeding: Promise<void> | null = null;

export async function seedOnce(): Promise<void> {
  if (!env.seedOnBoot) return;
  if (!seeding) {
    seeding = seedIfNeeded().catch((error: unknown) => {
      seeding = null;
      throw error;
    });
  }
  await seeding;
}

export async function seedIfNeeded(): Promise<void> {
  const [settingsCount, packsCount, classesCount, adminExists] = await Promise.all([
    SchoolSettings.countDocuments(),
    FeaturePackage.countDocuments(),
    ClassStructure.countDocuments(),
    User.exists({ email: env.adminEmail.toLowerCase() }),
  ]);

  // Fast path on Vercel cold starts: DB already bootstrapped — skip heavy catalog work
  if (settingsCount && packsCount && adminExists) {
    await upsertUser({
      email: env.ownerEmail,
      name: "Platform Owner",
      role: "platform_owner",
      password: env.ownerPassword,
    });
    await upsertUser({
      email: env.adminEmail,
      name: "School Admin",
      role: "school_admin",
      password: env.adminPassword,
    });
    for (const staff of DEMO_STAFF) {
      await upsertUser(staff);
    }
    logger.info("Demo users ready");
    return;
  }

  if (!settingsCount) {
    await SchoolSettings.create({ name: "Demo High School", academicYear: "2026", eiin: "000000" });
  }
  if (!packsCount) {
    await FeaturePackage.create({ modules: DEFAULT_FEATURES });
  } else {
    const pack = await FeaturePackage.findOne();
    if (pack) {
      pack.modules = normalizeModules(pack.modules) as never;
      await pack.save();
    }
  }

  await upsertUser({
    email: env.ownerEmail,
    name: "Platform Owner",
    role: "platform_owner",
    password: env.ownerPassword,
  });
  await upsertUser({
    email: env.adminEmail,
    name: "School Admin",
    role: "school_admin",
    password: env.adminPassword,
  });
  for (const staff of DEMO_STAFF) {
    await upsertUser(staff);
  }
  await User.updateMany(
    { role: { $in: ["school_admin", "teacher", "accountant", "guardian", "platform_owner"] } },
    { $set: { permissions: [] } }
  );
  logger.info("Demo users ready");
  await ensureCertificateTemplates();

  if (!classesCount) {
    const created = await ClassStructure.insertMany(
      DEFAULT_CLASSES.map((item) => ({
        ...item,
        group: "group" in item ? item.group : "None",
      }))
    );

    const subjectDocs = created.flatMap((klass) => {
      const names = [...COMMON_SUBJECTS];
      if (klass.level >= 3 && klass.level <= 8) names.push(...JUNIOR_EXTRA);
      if (klass.group === "Science") names.push(...SCIENCE);
      if (klass.group === "Business") names.push(...BUSINESS);
      if (klass.group === "Humanities") names.push(...HUMANITIES);
      const unique = [...new Set(names)];
      return unique.map((name, index) => ({
        name,
        code: `${klass.code}-${name.slice(0, 3).toUpperCase()}-${index}`,
        classId: klass._id,
        group: klass.group === "None" ? "Common" : klass.group,
        markDistribution: {
          cq: 60,
          mcq: 40,
          practical: ["Physics", "Chemistry", "Biology"].includes(name) ? 25 : 0,
          attendance: 0,
        },
      }));
    });
    await Subject.insertMany(subjectDocs);
    logger.info("Seeded NCTB classes and subjects");
    await ensureAllNctbSubjects();
  }
}

export async function ensureAllNctbSubjects(): Promise<void> {
  const classes = await ClassStructure.find().sort({ level: 1 });
  if (!classes.length) return;

  // Clean up any test dummy subject
  await Subject.deleteMany({ name: /^hello$/i });

  const defaultClass = classes.find((c) => c.level === 9 || c.level === 10) || classes[classes.length - 1];

  for (const item of MASTER_SUBJECT_CATALOG) {
    const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existing = await Subject.findOne({
      $or: [
        { name: new RegExp(`^${escaped}$`, "i") },
        { nameBn: item.nameBn },
      ],
    });

    if (!existing) {
      let targetClass = defaultClass;
      if (item.category === "Science") {
        targetClass = classes.find((c) => c.group === "Science") || defaultClass;
      } else if (item.category === "Business") {
        targetClass = classes.find((c) => c.group === "Business") || defaultClass;
      } else if (item.category === "Humanities") {
        targetClass = classes.find((c) => c.group === "Humanities") || defaultClass;
      }

      await Subject.create({
        name: item.name,
        nameBn: item.nameBn,
        code: `${targetClass.code}-${item.code}`,
        classId: targetClass._id,
        group: item.group,
        markDistribution: item.markDistribution || {
          cq: 60,
          mcq: 40,
          practical: 0,
          attendance: 0,
        },
        compulsory: !["Agriculture Studies", "Home Science", "Music", "Drawing", "Arabic"].includes(item.name),
      });
    } else {
      await Subject.updateMany(
        {
          $or: [
            { name: new RegExp(`^${escaped}$`, "i") },
            { nameBn: item.nameBn },
          ],
        },
        { $set: { nameBn: item.nameBn } }
      );
    }
  }
}

if (require.main === module) {
  const { connectDb } = require("../db/connect") as typeof import("../db/connect");
  connectDb()
    .then(() => seedIfNeeded())
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
