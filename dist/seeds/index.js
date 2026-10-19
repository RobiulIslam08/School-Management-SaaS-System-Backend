"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOnce = seedOnce;
exports.seedIfNeeded = seedIfNeeded;
exports.ensureAllNctbSubjects = ensureAllNctbSubjects;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const features_1 = require("../lib/features");
const ClassStructure_1 = require("../models/ClassStructure");
const FeaturePackage_1 = require("../models/FeaturePackage");
const SchoolSettings_1 = require("../models/SchoolSettings");
const Subject_1 = require("../models/Subject");
const User_1 = require("../models/User");
const certificate_service_1 = require("../app/modules/Certificate/certificate.service");
const website_service_1 = require("../app/modules/Website/website.service");
const logger_1 = require("../utils/logger");
const nctb_1 = require("./nctb");
const DEMO_STAFF = [
    { email: "teacher@example.com", name: "Demo Teacher", role: "teacher", password: "Teacher123456" },
    { email: "accounts@example.com", name: "Demo Accountant", role: "accountant", password: "Accounts123456" },
];
async function upsertUser(params) {
    const email = params.email.toLowerCase();
    const existing = await User_1.User.findOne({ email });
    if (existing)
        return;
    await User_1.User.create({
        email,
        name: params.name,
        passwordHash: await bcryptjs_1.default.hash(params.password, 10),
        role: params.role,
        permissions: [],
        isActive: true,
        totpEnabled: false,
    });
}
let seeding = null;
async function seedOnce() {
    if (!env_1.env.seedOnBoot)
        return;
    if (!seeding) {
        seeding = seedIfNeeded().catch((error) => {
            seeding = null;
            throw error;
        });
    }
    await seeding;
}
async function seedIfNeeded() {
    const [settingsCount, packsCount, classesCount, adminExists] = await Promise.all([
        SchoolSettings_1.SchoolSettings.countDocuments(),
        FeaturePackage_1.FeaturePackage.countDocuments(),
        ClassStructure_1.ClassStructure.countDocuments(),
        User_1.User.exists({ email: env_1.env.adminEmail.toLowerCase() }),
    ]);
    // Fast path on Vercel cold starts: DB already bootstrapped — skip heavy catalog work
    if (settingsCount && packsCount && adminExists) {
        await upsertUser({
            email: env_1.env.ownerEmail,
            name: "Platform Owner",
            role: "platform_owner",
            password: env_1.env.ownerPassword,
        });
        await upsertUser({
            email: env_1.env.adminEmail,
            name: "School Admin",
            role: "school_admin",
            password: env_1.env.adminPassword,
        });
        for (const staff of DEMO_STAFF) {
            await upsertUser(staff);
        }
        logger_1.logger.info("Demo users ready");
        return;
    }
    if (!settingsCount) {
        await SchoolSettings_1.SchoolSettings.create({ name: "Demo High School", academicYear: "2026", eiin: "000000" });
    }
    if (!packsCount) {
        await FeaturePackage_1.FeaturePackage.create({ modules: features_1.DEFAULT_FEATURES });
    }
    else {
        const pack = await FeaturePackage_1.FeaturePackage.findOne();
        if (pack) {
            pack.modules = (0, FeaturePackage_1.normalizeModules)(pack.modules);
            await pack.save();
        }
    }
    await upsertUser({
        email: env_1.env.ownerEmail,
        name: "Platform Owner",
        role: "platform_owner",
        password: env_1.env.ownerPassword,
    });
    await upsertUser({
        email: env_1.env.adminEmail,
        name: "School Admin",
        role: "school_admin",
        password: env_1.env.adminPassword,
    });
    for (const staff of DEMO_STAFF) {
        await upsertUser(staff);
    }
    await User_1.User.updateMany({ role: { $in: ["school_admin", "teacher", "accountant", "guardian", "platform_owner"] } }, { $set: { permissions: [] } });
    logger_1.logger.info("Demo users ready");
    await (0, certificate_service_1.ensureCertificateTemplates)();
    if (!classesCount) {
        const created = await ClassStructure_1.ClassStructure.insertMany(nctb_1.DEFAULT_CLASSES.map((item) => ({
            ...item,
            group: "group" in item ? item.group : "None",
        })));
        const subjectDocs = created.flatMap((klass) => {
            const names = [...nctb_1.COMMON_SUBJECTS];
            if (klass.level >= 3 && klass.level <= 8)
                names.push(...nctb_1.JUNIOR_EXTRA);
            if (klass.group === "Science")
                names.push(...nctb_1.SCIENCE);
            if (klass.group === "Business")
                names.push(...nctb_1.BUSINESS);
            if (klass.group === "Humanities")
                names.push(...nctb_1.HUMANITIES);
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
        await Subject_1.Subject.insertMany(subjectDocs);
        logger_1.logger.info("Seeded NCTB classes and subjects");
        await ensureAllNctbSubjects();
    }
    await (0, website_service_1.ensureWebsite)();
}
async function ensureAllNctbSubjects() {
    const classes = await ClassStructure_1.ClassStructure.find().sort({ level: 1 });
    if (!classes.length)
        return;
    // Clean up any test dummy subject
    await Subject_1.Subject.deleteMany({ name: /^hello$/i });
    const defaultClass = classes.find((c) => c.level === 9 || c.level === 10) || classes[classes.length - 1];
    for (const item of nctb_1.MASTER_SUBJECT_CATALOG) {
        const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const existing = await Subject_1.Subject.findOne({
            $or: [
                { name: new RegExp(`^${escaped}$`, "i") },
                { nameBn: item.nameBn },
            ],
        });
        if (!existing) {
            let targetClass = defaultClass;
            if (item.category === "Science") {
                targetClass = classes.find((c) => c.group === "Science") || defaultClass;
            }
            else if (item.category === "Business") {
                targetClass = classes.find((c) => c.group === "Business") || defaultClass;
            }
            else if (item.category === "Humanities") {
                targetClass = classes.find((c) => c.group === "Humanities") || defaultClass;
            }
            await Subject_1.Subject.create({
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
        }
        else {
            await Subject_1.Subject.updateMany({
                $or: [
                    { name: new RegExp(`^${escaped}$`, "i") },
                    { nameBn: item.nameBn },
                ],
            }, { $set: { nameBn: item.nameBn } });
        }
    }
}
if (require.main === module) {
    const { connectDb } = require("../db/connect");
    connectDb()
        .then(() => seedIfNeeded())
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
