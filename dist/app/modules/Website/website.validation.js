"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptLookupValidation = exports.resultLookupValidation = exports.syllabusOutlineValidation = exports.websiteInquiryValidation = exports.websiteFileValidation = exports.websitePersonValidation = exports.websiteMediaValidation = exports.websiteAlbumValidation = exports.websitePostValidation = exports.websitePageUpdateValidation = exports.websitePageValidation = exports.websiteConfigValidation = void 0;
const zod_1 = require("zod");
const text = (max) => zod_1.z.string().max(max).optional();
const blockSchema = zod_1.z.object({
    type: zod_1.z.enum(["paragraph", "list", "image", "heading"]),
    textBn: text(4000),
    textEn: text(4000),
    itemsBn: zod_1.z.array(zod_1.z.string().max(300)).max(20).optional(),
    itemsEn: zod_1.z.array(zod_1.z.string().max(300)).max(20).optional(),
    imageUrl: zod_1.z.string().max(2_000_000).optional(),
    alt: zod_1.z.string().max(180).optional(),
});
const menuChild = zod_1.z.object({
    key: zod_1.z.string().min(1).max(40),
    href: zod_1.z.string().min(1).max(120),
    labelBn: zod_1.z.string().max(80),
    labelEn: zod_1.z.string().max(80),
    visible: zod_1.z.boolean(),
});
const menuItem = menuChild.extend({
    locked: zod_1.z.boolean().optional(),
    children: zod_1.z.array(menuChild).max(16),
});
exports.websiteConfigValidation = zod_1.z.object({
    phone: text(40),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    officeHours: text(160),
    mapEmbedUrl: zod_1.z.string().max(2000).optional(),
    facebook: zod_1.z.string().max(300).optional(),
    youtube: zod_1.z.string().max(300).optional(),
    themePreset: zod_1.z.enum(["heritage", "royal", "crimson", "azure", "custom"]).optional(),
    themePrimary: zod_1.z.string().max(20).optional(),
    heroTitleBn: text(80),
    heroTitleEn: text(80),
    heroSubtitleBn: text(180),
    heroSubtitleEn: text(180),
    heroImageUrl: zod_1.z.string().max(2_000_000).optional(),
    heroVideoUrl: zod_1.z.string().max(300).optional(),
    whyChooseUs: zod_1.z
        .array(zod_1.z.object({
        titleBn: text(60),
        titleEn: text(60),
        bodyBn: text(180),
        bodyEn: text(180),
    }))
        .max(6)
        .optional(),
    stats: zod_1.z
        .array(zod_1.z.object({
        labelBn: text(40),
        labelEn: text(40),
        value: text(20),
    }))
        .max(8)
        .optional(),
    principalName: text(80),
    principalDesignation: text(80),
    principalPhotoUrl: zod_1.z.string().max(2_000_000).optional(),
    principalQuoteBn: text(280),
    principalQuoteEn: text(280),
    homeIntroBn: text(800),
    homeIntroEn: text(800),
    tasks: zod_1.z
        .array(zod_1.z.object({
        titleBn: text(80),
        titleEn: text(80),
        bodyBn: text(240),
        bodyEn: text(240),
    }))
        .max(3)
        .optional(),
    admitTitleBn: text(80),
    admitTitleEn: text(80),
    admitBodyBn: text(240),
    admitBodyEn: text(240),
    desks: zod_1.z
        .array(zod_1.z.object({
        key: zod_1.z.string().min(2).max(40),
        noteBn: text(800),
        noteEn: text(800),
        dutiesBn: zod_1.z.array(zod_1.z.string().max(160)).max(8).optional(),
        dutiesEn: zod_1.z.array(zod_1.z.string().max(160)).max(8).optional(),
        visitBn: zod_1.z.array(zod_1.z.string().max(160)).max(8).optional(),
        visitEn: zod_1.z.array(zod_1.z.string().max(160)).max(8).optional(),
    }))
        .max(16)
        .optional(),
    resultLookupEnabled: zod_1.z.boolean().optional(),
    receiptLookupEnabled: zod_1.z.boolean().optional(),
    meritListEnabled: zod_1.z.boolean().optional(),
    seoDescriptionBn: text(160),
    seoDescriptionEn: text(160),
    menus: zod_1.z.array(menuItem).max(12).optional(),
});
exports.websitePageValidation = zod_1.z.object({
    slug: zod_1.z
        .string()
        .min(2)
        .max(60)
        .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
    menuKey: zod_1.z.string().min(2).max(40),
    titleBn: text(120),
    titleEn: text(120),
    summaryBn: text(240),
    summaryEn: text(240),
    blocks: zod_1.z.array(blockSchema).max(30).optional(),
    seoDescriptionBn: text(160),
    seoDescriptionEn: text(160),
    status: zod_1.z.enum(["draft", "published"]).optional(),
    sortOrder: zod_1.z.number().int().min(0).max(999).optional(),
});
exports.websitePageUpdateValidation = exports.websitePageValidation.partial();
exports.websitePostValidation = zod_1.z.object({
    kind: zod_1.z.enum(["news", "event", "program"]).optional(),
    titleBn: text(140),
    titleEn: text(140),
    bodyBn: text(8000),
    bodyEn: text(8000),
    coverUrl: zod_1.z.string().max(2_000_000).optional(),
    coverAlt: text(180),
    eventDate: zod_1.z.string().optional(),
    pinned: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(["draft", "published"]).optional(),
    seoDescriptionBn: text(160),
    seoDescriptionEn: text(160),
});
exports.websiteAlbumValidation = zod_1.z.object({
    titleBn: text(80),
    titleEn: text(80),
    kind: zod_1.z.enum(["campus", "cultural", "sports", "other"]).optional(),
    coverUrl: zod_1.z.string().max(2_000_000).optional(),
    status: zod_1.z.enum(["draft", "published"]).optional(),
    sortOrder: zod_1.z.number().int().optional(),
});
exports.websiteMediaValidation = zod_1.z.object({
    albumId: zod_1.z.string().optional(),
    kind: zod_1.z.enum(["image", "video"]).optional(),
    url: zod_1.z.string().max(2_000_000).optional(),
    videoUrl: zod_1.z.string().max(300).optional(),
    alt: text(180),
    captionBn: text(180),
    captionEn: text(180),
    status: zod_1.z.enum(["draft", "published"]).optional(),
});
exports.websitePersonValidation = zod_1.z.object({
    board: zod_1.z.string().min(2).max(40),
    name: zod_1.z.string().min(2).max(80),
    designation: text(80),
    photoUrl: zod_1.z.string().max(2_000_000).optional(),
    bioBn: text(2000),
    bioEn: text(2000),
    phone: text(40),
    teacherId: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().optional(),
    status: zod_1.z.enum(["draft", "published"]).optional(),
});
exports.websiteFileValidation = zod_1.z.object({
    kind: zod_1.z.enum(["syllabus", "routine", "prospectus", "form", "calendar"]),
    titleBn: text(120),
    titleEn: text(120),
    classId: zod_1.z.string().optional(),
    academicYear: text(12),
    filename: text(120),
    dataUrl: zod_1.z.string().min(20),
    status: zod_1.z.enum(["draft", "published"]).optional(),
});
exports.websiteInquiryValidation = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80),
    phone: zod_1.z.string().max(40).optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    message: zod_1.z.string().min(5).max(2000),
    website: zod_1.z.string().max(200).optional(),
});
exports.syllabusOutlineValidation = zod_1.z.object({
    classId: zod_1.z.string().min(1),
    subjectId: zod_1.z.string().min(1),
    academicYear: zod_1.z.string().max(12).optional(),
    chaptersBn: zod_1.z.array(zod_1.z.string().max(80)).max(12).optional(),
    chaptersEn: zod_1.z.array(zod_1.z.string().max(80)).max(12).optional(),
});
exports.resultLookupValidation = zod_1.z.object({
    studentId: zod_1.z.string().min(2).max(40),
    examTypeId: zod_1.z.string().optional(),
});
exports.receiptLookupValidation = zod_1.z.object({
    studentId: zod_1.z.string().min(2).max(40),
});
