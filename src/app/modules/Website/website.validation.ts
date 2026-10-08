import { z } from "zod";

const text = (max: number) => z.string().max(max).optional();

const blockSchema = z.object({
  type: z.enum(["paragraph", "list", "image", "heading"]),
  textBn: text(4000),
  textEn: text(4000),
  itemsBn: z.array(z.string().max(300)).max(20).optional(),
  itemsEn: z.array(z.string().max(300)).max(20).optional(),
  imageUrl: z.string().max(2_000_000).optional(),
  alt: z.string().max(180).optional(),
});

const menuChild = z.object({
  key: z.string().min(1).max(40),
  href: z.string().min(1).max(120),
  labelBn: z.string().max(80),
  labelEn: z.string().max(80),
  visible: z.boolean(),
});

const menuItem = menuChild.extend({
  locked: z.boolean().optional(),
  children: z.array(menuChild).max(16),
});

export const websiteConfigValidation = z.object({
  phone: text(40),
  email: z.string().email().optional().or(z.literal("")),
  officeHours: text(160),
  mapEmbedUrl: z.string().max(2000).optional(),
  facebook: z.string().max(300).optional(),
  youtube: z.string().max(300).optional(),
  themePreset: z.enum(["heritage", "royal", "crimson", "azure", "custom"]).optional(),
  themePrimary: z.string().max(20).optional(),
  heroTitleBn: text(80),
  heroTitleEn: text(80),
  heroSubtitleBn: text(180),
  heroSubtitleEn: text(180),
  heroImageUrl: z.string().max(2_000_000).optional(),
  heroVideoUrl: z.string().max(300).optional(),
  whyChooseUs: z
    .array(
      z.object({
        titleBn: text(60),
        titleEn: text(60),
        bodyBn: text(180),
        bodyEn: text(180),
      })
    )
    .max(6)
    .optional(),
  stats: z
    .array(
      z.object({
        labelBn: text(40),
        labelEn: text(40),
        value: text(20),
      })
    )
    .max(8)
    .optional(),
  principalName: text(80),
  principalDesignation: text(80),
  principalPhotoUrl: z.string().max(2_000_000).optional(),
  principalQuoteBn: text(280),
  principalQuoteEn: text(280),
  homeIntroBn: text(800),
  homeIntroEn: text(800),
  tasks: z
    .array(
      z.object({
        titleBn: text(80),
        titleEn: text(80),
        bodyBn: text(240),
        bodyEn: text(240),
      })
    )
    .max(3)
    .optional(),
  admitTitleBn: text(80),
  admitTitleEn: text(80),
  admitBodyBn: text(240),
  admitBodyEn: text(240),
  desks: z
    .array(
      z.object({
        key: z.string().min(2).max(40),
        noteBn: text(800),
        noteEn: text(800),
        dutiesBn: z.array(z.string().max(160)).max(8).optional(),
        dutiesEn: z.array(z.string().max(160)).max(8).optional(),
        visitBn: z.array(z.string().max(160)).max(8).optional(),
        visitEn: z.array(z.string().max(160)).max(8).optional(),
      })
    )
    .max(12)
    .optional(),
  resultLookupEnabled: z.boolean().optional(),
  receiptLookupEnabled: z.boolean().optional(),
  meritListEnabled: z.boolean().optional(),
  seoDescriptionBn: text(160),
  seoDescriptionEn: text(160),
  menus: z.array(menuItem).max(12).optional(),
});

export const websitePageValidation = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
  menuKey: z.string().min(2).max(40),
  titleBn: text(120),
  titleEn: text(120),
  summaryBn: text(240),
  summaryEn: text(240),
  blocks: z.array(blockSchema).max(30).optional(),
  seoDescriptionBn: text(160),
  seoDescriptionEn: text(160),
  status: z.enum(["draft", "published"]).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

export const websitePageUpdateValidation = websitePageValidation.partial();

export const websitePostValidation = z.object({
  kind: z.enum(["news", "event", "program"]).optional(),
  titleBn: text(140),
  titleEn: text(140),
  bodyBn: text(8000),
  bodyEn: text(8000),
  coverUrl: z.string().max(2_000_000).optional(),
  coverAlt: text(180),
  eventDate: z.string().optional(),
  pinned: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  seoDescriptionBn: text(160),
  seoDescriptionEn: text(160),
});

export const websiteAlbumValidation = z.object({
  titleBn: text(80),
  titleEn: text(80),
  kind: z.enum(["campus", "cultural", "sports", "other"]).optional(),
  coverUrl: z.string().max(2_000_000).optional(),
  status: z.enum(["draft", "published"]).optional(),
  sortOrder: z.number().int().optional(),
});

export const websiteMediaValidation = z.object({
  albumId: z.string().optional(),
  kind: z.enum(["image", "video"]).optional(),
  url: z.string().max(2_000_000).optional(),
  videoUrl: z.string().max(300).optional(),
  alt: text(180),
  captionBn: text(180),
  captionEn: text(180),
  status: z.enum(["draft", "published"]).optional(),
});

export const websitePersonValidation = z.object({
  board: z.string().min(2).max(40),
  name: z.string().min(2).max(80),
  designation: text(80),
  photoUrl: z.string().max(2_000_000).optional(),
  bioBn: text(800),
  bioEn: text(800),
  phone: text(40),
  teacherId: z.string().optional(),
  sortOrder: z.number().int().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const websiteFileValidation = z.object({
  kind: z.enum(["syllabus", "routine", "prospectus", "form", "calendar"]),
  titleBn: text(120),
  titleEn: text(120),
  classId: z.string().optional(),
  academicYear: text(12),
  filename: text(120),
  dataUrl: z.string().min(20),
  status: z.enum(["draft", "published"]).optional(),
});

export const websiteInquiryValidation = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().max(40).optional(),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(5).max(2000),
  website: z.string().max(200).optional(),
});

export const syllabusOutlineValidation = z.object({
  classId: z.string().min(1),
  subjectId: z.string().min(1),
  academicYear: z.string().max(12).optional(),
  chaptersBn: z.array(z.string().max(80)).max(12).optional(),
  chaptersEn: z.array(z.string().max(80)).max(12).optional(),
});

export const resultLookupValidation = z.object({
  studentId: z.string().min(2).max(40),
  examTypeId: z.string().optional(),
});

export const receiptLookupValidation = z.object({
  studentId: z.string().min(2).max(40),
});
