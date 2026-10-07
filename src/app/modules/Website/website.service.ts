import mongoose from "mongoose";
import { ClassStructure } from "../../../models/ClassStructure";
import { FeaturePackage, normalizeModules } from "../../../models/FeaturePackage";
import { ExamType } from "../../../models/ExamType";
import { Result } from "../../../models/Result";
import { Routine } from "../../../models/Routine";
import { SchoolSettings } from "../../../models/SchoolSettings";
import { Student } from "../../../models/Student";
import { Subject } from "../../../models/Subject";
import { Teacher } from "../../../models/Teacher";
import {
  WebsiteAlbum,
  WebsiteConfig,
  WebsiteFile,
  WebsiteInquiry,
  WebsiteMedia,
  WebsitePage,
  WebsitePerson,
  WebsitePost,
} from "../../../models/Website";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId, routeParam } from "../../../utils/persist";
import { listPublicNotices } from "../Notice/notice.service";
import { defaultAdmit, defaultConfig, defaultPages, defaultPosts, publicDesks, publicTasks, type MenuItem } from "./website.defaults";
import { ensureNoticeBoard } from "../Notice/notice.board";
import { ensureWebsiteShowcase } from "./website.showcase";
import { RESULT_MISS, decodeMediaDataUrl, isAllowedImage, isEmbedUrl, seoLengthOk } from "./website.guards";
import { themeTokens } from "./website.theme";

type PageInput = {
  slug?: string;
  menuKey?: string;
  titleBn?: string;
  titleEn?: string;
  summaryBn?: string;
  summaryEn?: string;
  blocks?: Array<{
    type: "paragraph" | "list" | "image" | "heading";
    textBn?: string;
    textEn?: string;
    itemsBn?: string[];
    itemsEn?: string[];
    imageUrl?: string;
    alt?: string;
  }>;
  seoDescriptionBn?: string;
  seoDescriptionEn?: string;
  status?: "draft" | "published";
  sortOrder?: number;
};

let ensuring: Promise<void> | null = null;

export async function ensureWebsite(): Promise<void> {
  if (!ensuring) {
    ensuring = seedWebsiteIfEmpty().catch((error: unknown) => {
      ensuring = null;
      throw error;
    });
  }
  await ensuring;
}

async function seedWebsiteIfEmpty(): Promise<void> {
  if (!(await WebsiteConfig.exists({}))) {
    await WebsiteConfig.create(defaultConfig());
  }
  if (!(await WebsitePage.exists({}))) {
    await WebsitePage.insertMany(defaultPages());
  }
  if (!(await WebsitePost.exists({}))) {
    await WebsitePost.insertMany(defaultPosts());
  }
  await ensureWebsiteShowcase();
  await ensureNoticeBoard();
}

const STORED_SEO_BN = "স্কুলের নোটিশ, ভর্তি, শিক্ষক, রুটিন ও প্রকাশিত ফলাফল দেখুন।";
const STORED_SEO_EN = "Notices, admission, teachers, routines, and published results for this school.";

function clipSeo(value: string): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;
  return `${clean.slice(0, 157).trimEnd()}...`;
}

function sideReady(value: string): boolean {
  const clean = value.trim();
  return clean.length >= 50 && clean.length <= 160;
}

function fillSide(value: string, sources: string[], fallback: string): string {
  const clipped = clipSeo(value);
  if (sideReady(clipped)) return clipped;
  const joined = clipSeo(sources.map((item) => item.replace(/\s+/g, " ").trim()).filter((item) => item.length >= 20).join(" "));
  if (sideReady(joined)) return joined;
  const withFallback = clipSeo(`${joined} ${fallback}`.trim());
  return sideReady(withFallback) ? withFallback : fallback;
}

function readySeo(bn: string, en: string, bnSources: string[], enSources: string[]): { bn: string; en: string } {
  if (seoLengthOk(bn, en)) return { bn: bn.trim(), en: en.trim() };
  const next = { bn: fillSide(bn, bnSources, STORED_SEO_BN), en: fillSide(en, enSources, STORED_SEO_EN) };
  return seoLengthOk(next.bn, next.en) ? next : { bn: STORED_SEO_BN, en: STORED_SEO_EN };
}

function pageCopy(page: PageInput, language: "bn" | "en"): string[] {
  const blocks = (page.blocks ?? []).flatMap((block) => (
    block.type === "list"
      ? (language === "bn" ? block.itemsBn : block.itemsEn) ?? []
      : [language === "bn" ? block.textBn ?? "" : block.textEn ?? ""]
  ));
  return language === "bn"
    ? [page.titleBn ?? "", page.summaryBn ?? "", ...blocks]
    : [page.titleEn ?? "", page.summaryEn ?? "", ...blocks];
}

function assertSeo(status: string | undefined, bn: string, en: string, entity: string): void {
  if (status !== "published") return;
  if (!seoLengthOk(bn, en)) {
    throw new ApiError(400, msg.invalid(entity, "SEO description must be 50 to 160 characters before publishing."));
  }
}

function assertTitle(status: string | undefined, bn: string, en: string, entity: string): void {
  if (status !== "published") return;
  if (!(bn.trim() || en.trim())) {
    throw new ApiError(400, msg.invalid(entity, "A title is required to publish."));
  }
}

function assertOptionalImage(value: string | undefined, entity: string): void {
  if (!value || isAllowedImage(value)) return;
  throw new ApiError(400, msg.invalid(entity, "Upload a JPEG, PNG, or WebP image."));
}

function assertBlocks(blocks: PageInput["blocks"], status: string | undefined): void {
  for (const block of blocks ?? []) {
    if (block.type !== "image") continue;
    if (block.imageUrl) assertOptionalImage(block.imageUrl, "Page");
    if (status === "published" && block.imageUrl && !block.alt?.trim()) {
      throw new ApiError(400, msg.invalid("Page", "Each published image needs a description."));
    }
  }
}

function cleanHttps(value: string | undefined, hosts: string[] | null, entity: string): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ApiError(400, msg.invalid(entity, "Use a full https link."));
  }
  if (url.protocol !== "https:") {
    throw new ApiError(400, msg.invalid(entity, "Use a full https link."));
  }
  if (hosts && !hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
    throw new ApiError(400, msg.invalid(entity, "This link is not allowed."));
  }
  return url.toString();
}

function cleanMap(value: string | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const iframe = /src=["']([^"']+)["']/.exec(raw);
  return cleanHttps(iframe?.[1] ?? raw, ["google.com", "google.com.bd", "openstreetmap.org"], "Map");
}

function lockMenus(menus: MenuItem[] | undefined): MenuItem[] {
  const source = menus?.length ? menus : defaultConfig().menus;
  const locked = new Set(["home", "contact", "login"]);
  return source.map((item) => (locked.has(item.key) ? { ...item, visible: true, locked: true } : item));
}

function publicConfig(doc: Record<string, unknown>) {
  const theme = themeTokens(String(doc.themePreset ?? "heritage"), String(doc.themePrimary ?? ""));
  const stats = Array.isArray(doc.stats)
    ? doc.stats.filter((item) => item && typeof item === "object" && String((item as { value?: string }).value ?? "").trim())
    : [];
  const why = Array.isArray(doc.whyChooseUs)
    ? doc.whyChooseUs
        .filter((item) => {
          if (!item || typeof item !== "object") return false;
          const row = item as { titleBn?: string; titleEn?: string };
          return Boolean(String(row.titleBn ?? "").trim() || String(row.titleEn ?? "").trim());
        })
        .slice(0, 6)
    : [];
  const admit = defaultAdmit();
  return {
    phone: doc.phone ?? "",
    email: doc.email ?? "",
    officeHours: doc.officeHours ?? "",
    mapEmbedUrl: doc.mapEmbedUrl ?? "",
    facebook: doc.facebook ?? "",
    youtube: doc.youtube ?? "",
    theme,
    heroTitleBn: doc.heroTitleBn ?? "",
    heroTitleEn: doc.heroTitleEn ?? "",
    heroSubtitleBn: doc.heroSubtitleBn ?? "",
    heroSubtitleEn: doc.heroSubtitleEn ?? "",
    heroImageUrl: doc.heroImageUrl ?? "",
    heroVideoUrl: doc.heroVideoUrl ?? "",
    whyChooseUs: why,
    stats,
    principalName: doc.principalName ?? "",
    principalDesignation: doc.principalDesignation ?? "",
    principalPhotoUrl: doc.principalPhotoUrl ?? "",
    principalQuoteBn: doc.principalQuoteBn ?? "",
    principalQuoteEn: doc.principalQuoteEn ?? "",
    homeIntroBn: doc.homeIntroBn ?? "",
    homeIntroEn: doc.homeIntroEn ?? "",
    tasks: publicTasks(doc.tasks),
    admitTitleBn: doc.admitTitleBn || admit.admitTitleBn,
    admitTitleEn: doc.admitTitleEn || admit.admitTitleEn,
    admitBodyBn: doc.admitBodyBn || admit.admitBodyBn,
    admitBodyEn: doc.admitBodyEn || admit.admitBodyEn,
    desks: publicDesks(doc.desks),
    resultLookupEnabled: doc.resultLookupEnabled !== false,
    meritListEnabled: doc.meritListEnabled === true,
    seoDescriptionBn: doc.seoDescriptionBn ?? "",
    seoDescriptionEn: doc.seoDescriptionEn ?? "",
    menus: lockMenus(doc.menus as MenuItem[] | undefined),
  };
}

async function configDoc() {
  await ensureWebsite();
  const doc = await WebsiteConfig.findOne();
  if (!doc) throw new ApiError(500, msg.server);
  return doc;
}

export async function getAdminBundle() {
  await ensureWebsite();
  const [config, pages, posts, albums, media, people, files, inquiries] = await Promise.all([
    WebsiteConfig.findOne().lean(),
    WebsitePage.find().sort({ menuKey: 1, sortOrder: 1 }).lean(),
    WebsitePost.find().sort({ pinned: -1, createdAt: -1 }).lean(),
    WebsiteAlbum.find().sort({ sortOrder: 1, createdAt: -1 }).lean(),
    WebsiteMedia.find().sort({ createdAt: -1 }).lean(),
    WebsitePerson.find().sort({ board: 1, sortOrder: 1 }).lean(),
    WebsiteFile.find().select("-data").sort({ createdAt: -1 }).lean(),
    WebsiteInquiry.find().sort({ createdAt: -1 }).limit(100).lean(),
  ]);
  return { config, pages, posts, albums, media, people, files, inquiries };
}

export async function saveConfig(body: Record<string, unknown>) {
  const doc = await configDoc();
  assertOptionalImage(typeof body.heroImageUrl === "string" ? body.heroImageUrl : undefined, "Hero image");
  assertOptionalImage(typeof body.principalPhotoUrl === "string" ? body.principalPhotoUrl : undefined, "Principal photo");
  if (typeof body.heroVideoUrl === "string" && !isEmbedUrl(body.heroVideoUrl)) {
    throw new ApiError(400, msg.invalid("Video", "Use a YouTube or Facebook link."));
  }
  const seo = readySeo(
    String(body.seoDescriptionBn ?? doc.get("seoDescriptionBn") ?? ""),
    String(body.seoDescriptionEn ?? doc.get("seoDescriptionEn") ?? ""),
    [String(body.heroTitleBn ?? ""), String(body.heroSubtitleBn ?? "")],
    [String(body.heroTitleEn ?? ""), String(body.heroSubtitleEn ?? "")]
  );
  body.seoDescriptionBn = seo.bn;
  body.seoDescriptionEn = seo.en;
  const next = {
    ...body,
    mapEmbedUrl: body.mapEmbedUrl !== undefined ? cleanMap(String(body.mapEmbedUrl ?? "")) : doc.get("mapEmbedUrl"),
    facebook: body.facebook !== undefined ? cleanHttps(String(body.facebook ?? ""), ["facebook.com", "fb.com"], "Facebook") : doc.get("facebook"),
    youtube: body.youtube !== undefined ? cleanHttps(String(body.youtube ?? ""), ["youtube.com", "youtu.be"], "YouTube") : doc.get("youtube"),
    menus: body.menus ? lockMenus(body.menus as MenuItem[]) : doc.get("menus"),
    whyChooseUs: Array.isArray(body.whyChooseUs)
      ? body.whyChooseUs
          .filter((item) => {
            if (!item || typeof item !== "object") return false;
            const row = item as { titleBn?: string; titleEn?: string };
            return Boolean(String(row.titleBn ?? "").trim() || String(row.titleEn ?? "").trim());
          })
          .slice(0, 6)
      : doc.get("whyChooseUs"),
    stats: Array.isArray(body.stats)
      ? body.stats
          .filter((item) => {
            if (!item || typeof item !== "object") return false;
            const row = item as { value?: string; labelBn?: string; labelEn?: string };
            return Boolean(String(row.value ?? "").trim() || String(row.labelBn ?? "").trim() || String(row.labelEn ?? "").trim());
          })
          .slice(0, 8)
      : doc.get("stats"),
    tasks: Array.isArray(body.tasks) ? body.tasks.slice(0, 3) : doc.get("tasks"),
    desks: Array.isArray(body.desks) ? body.desks.slice(0, 12) : doc.get("desks"),
  };
  doc.set(next);
  await doc.save();
  return doc.toObject();
}

export async function createPage(body: PageInput) {
  assertTitle(body.status, body.titleBn ?? "", body.titleEn ?? "", "Page");
  if (body.status === "published") {
    const seo = readySeo(body.seoDescriptionBn ?? "", body.seoDescriptionEn ?? "", pageCopy(body, "bn"), pageCopy(body, "en"));
    body.seoDescriptionBn = seo.bn;
    body.seoDescriptionEn = seo.en;
  }
  assertSeo(body.status, body.seoDescriptionBn ?? "", body.seoDescriptionEn ?? "", "Page");
  assertBlocks(body.blocks, body.status);
  try {
    return await WebsitePage.create(body);
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as { code?: number }).code === 11000) {
      throw new ApiError(409, msg.duplicate("Page", "Slug"));
    }
    throw error;
  }
}

export async function updatePage(id: string | undefined, body: PageInput) {
  const page = await WebsitePage.findById(requireId(id, "Page"));
  if (!page) throw new ApiError(404, msg.notFound("Page"));
  const next = { ...page.toObject(), ...body };
  assertTitle(next.status, next.titleBn ?? "", next.titleEn ?? "", "Page");
  if (next.status === "published") {
    const seo = readySeo(next.seoDescriptionBn ?? "", next.seoDescriptionEn ?? "", pageCopy(next, "bn"), pageCopy(next, "en"));
    body.seoDescriptionBn = seo.bn;
    body.seoDescriptionEn = seo.en;
  }
  assertSeo(next.status, body.seoDescriptionBn ?? next.seoDescriptionBn ?? "", body.seoDescriptionEn ?? next.seoDescriptionEn ?? "", "Page");
  assertBlocks(next.blocks, next.status);
  page.set(body);
  await page.save();
  return page;
}

export async function deletePage(id: string | undefined) {
  const page = await WebsitePage.findByIdAndDelete(requireId(id, "Page"));
  if (!page) throw new ApiError(404, msg.notFound("Page"));
  return { deleted: true };
}

export async function createPost(body: Record<string, unknown>) {
  const status = String(body.status ?? "draft");
  assertTitle(status, String(body.titleBn ?? ""), String(body.titleEn ?? ""), "Post");
  if (status === "published") {
    const seo = readySeo(
      String(body.seoDescriptionBn ?? ""),
      String(body.seoDescriptionEn ?? ""),
      [String(body.titleBn ?? ""), String(body.bodyBn ?? "")],
      [String(body.titleEn ?? ""), String(body.bodyEn ?? "")]
    );
    body.seoDescriptionBn = seo.bn;
    body.seoDescriptionEn = seo.en;
  }
  assertSeo(status, String(body.seoDescriptionBn ?? ""), String(body.seoDescriptionEn ?? ""), "Post");
  assertOptionalImage(typeof body.coverUrl === "string" ? body.coverUrl : undefined, "Cover");
  if (status === "published" && body.coverUrl && !String(body.coverAlt ?? "").trim()) {
    throw new ApiError(400, msg.invalid("Post", "A published cover image needs a description."));
  }
  return WebsitePost.create(body);
}

export async function updatePost(id: string | undefined, body: Record<string, unknown>) {
  const post = await WebsitePost.findById(requireId(id, "Post"));
  if (!post) throw new ApiError(404, msg.notFound("Post"));
  post.set(body);
  const status = String(post.get("status") ?? "draft");
  assertTitle(status, String(post.get("titleBn") ?? ""), String(post.get("titleEn") ?? ""), "Post");
  if (status === "published") {
    const seo = readySeo(
      String(post.get("seoDescriptionBn") ?? ""),
      String(post.get("seoDescriptionEn") ?? ""),
      [String(post.get("titleBn") ?? ""), String(post.get("bodyBn") ?? "")],
      [String(post.get("titleEn") ?? ""), String(post.get("bodyEn") ?? "")]
    );
    post.set({ seoDescriptionBn: seo.bn, seoDescriptionEn: seo.en });
  }
  assertSeo(status, String(post.get("seoDescriptionBn") ?? ""), String(post.get("seoDescriptionEn") ?? ""), "Post");
  assertOptionalImage(String(post.get("coverUrl") ?? ""), "Cover");
  await post.save();
  return post;
}

export async function deletePost(id: string | undefined) {
  const post = await WebsitePost.findByIdAndDelete(requireId(id, "Post"));
  if (!post) throw new ApiError(404, msg.notFound("Post"));
  return { deleted: true };
}

export async function createAlbum(body: Record<string, unknown>) {
  assertOptionalImage(typeof body.coverUrl === "string" ? body.coverUrl : undefined, "Album");
  return WebsiteAlbum.create(body);
}

export async function updateAlbum(id: string | undefined, body: Record<string, unknown>) {
  const album = await WebsiteAlbum.findById(requireId(id, "Album"));
  if (!album) throw new ApiError(404, msg.notFound("Album"));
  assertOptionalImage(typeof body.coverUrl === "string" ? body.coverUrl : undefined, "Album");
  album.set(body);
  await album.save();
  return album;
}

export async function deleteAlbum(id: string | undefined) {
  const albumId = requireId(id, "Album");
  const album = await WebsiteAlbum.findByIdAndDelete(albumId);
  if (!album) throw new ApiError(404, msg.notFound("Album"));
  await WebsiteMedia.deleteMany({ albumId });
  return { deleted: true };
}

export async function createMedia(body: Record<string, unknown>) {
  const kind = body.kind === "video" ? "video" : "image";
  const status = String(body.status ?? "draft");
  if (kind === "image") {
    assertOptionalImage(typeof body.url === "string" ? body.url : undefined, "Image");
    if (status === "published" && !String(body.alt ?? "").trim()) {
      throw new ApiError(400, msg.invalid("Image", "A description is required before publishing."));
    }
  } else if (!isEmbedUrl(String(body.videoUrl ?? ""))) {
    throw new ApiError(400, msg.invalid("Video", "Use a YouTube or Facebook link."));
  }
  return WebsiteMedia.create(body);
}

export async function deleteMedia(id: string | undefined) {
  const media = await WebsiteMedia.findByIdAndDelete(requireId(id, "Media"));
  if (!media) throw new ApiError(404, msg.notFound("Media"));
  return { deleted: true };
}

export async function createPerson(body: Record<string, unknown>) {
  assertOptionalImage(typeof body.photoUrl === "string" ? body.photoUrl : undefined, "Photo");
  if (body.teacherId && mongoose.isValidObjectId(String(body.teacherId))) {
    const teacher = await Teacher.findById(body.teacherId).select("name designation photoUrl");
    if (teacher) {
      body.name = body.name || teacher.name;
      body.designation = body.designation || teacher.designation;
      body.photoUrl = body.photoUrl || teacher.photoUrl;
    }
  } else {
    delete body.teacherId;
  }
  return WebsitePerson.create(body);
}

export async function updatePerson(id: string | undefined, body: Record<string, unknown>) {
  const person = await WebsitePerson.findById(requireId(id, "Person"));
  if (!person) throw new ApiError(404, msg.notFound("Person"));
  assertOptionalImage(typeof body.photoUrl === "string" ? body.photoUrl : undefined, "Photo");
  person.set(body);
  await person.save();
  return person;
}

export async function deletePerson(id: string | undefined) {
  const person = await WebsitePerson.findByIdAndDelete(requireId(id, "Person"));
  if (!person) throw new ApiError(404, msg.notFound("Person"));
  return { deleted: true };
}

export async function createFile(body: {
  kind: "syllabus" | "routine" | "prospectus" | "form" | "calendar";
  titleBn?: string;
  titleEn?: string;
  classId?: string;
  academicYear?: string;
  filename?: string;
  dataUrl: string;
  status?: string;
}) {
  let decoded: { mime: string; buffer: Buffer };
  try {
    decoded = decodeMediaDataUrl(body.dataUrl, "pdf");
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Invalid file";
    throw new ApiError(400, msg.invalid("File", reason));
  }
  const title = (body.titleBn || body.titleEn || "").trim();
  if (!title) throw new ApiError(400, msg.invalid("File", "A title is required."));
  return WebsiteFile.create({
    kind: body.kind,
    titleBn: body.titleBn ?? "",
    titleEn: body.titleEn ?? "",
    classId: body.classId && mongoose.isValidObjectId(body.classId) ? body.classId : undefined,
    academicYear: body.academicYear ?? "",
    filename: (body.filename || "file.pdf").replace(/[^a-zA-Z0-9._-]/g, "") || "file.pdf",
    mime: decoded.mime,
    data: decoded.buffer,
    size: decoded.buffer.length,
    status: body.status === "draft" ? "draft" : "published",
  });
}

export async function deleteFile(id: string | undefined) {
  const file = await WebsiteFile.findByIdAndDelete(requireId(id, "File"));
  if (!file) throw new ApiError(404, msg.notFound("File"));
  return { deleted: true };
}

export async function markInquiry(id: string | undefined, read: boolean) {
  const inquiry = await WebsiteInquiry.findById(requireId(id, "Inquiry"));
  if (!inquiry) throw new ApiError(404, msg.notFound("Inquiry"));
  inquiry.set("read", read);
  await inquiry.save();
  return inquiry;
}

export async function getPublicSite() {
  await ensureWebsite();
  const [settings, config, pack, notices, posts, teachers, classes, subjects, people, pages, albums, files, albumCounts, videos] = await Promise.all([
    SchoolSettings.findOne().select("name logoUrl motto address eiin establishedYear academicYear").lean(),
    WebsiteConfig.findOne().lean(),
    FeaturePackage.findOne().select("modules").lean(),
    listPublicNotices(),
    WebsitePost.find({ status: "published" }).sort({ pinned: -1, eventDate: -1, createdAt: -1 }).limit(8).lean(),
    Teacher.find({ isActive: true }).select("name designation photoUrl phone").sort({ name: 1 }).limit(24).lean(),
    ClassStructure.find({ isActive: true }).select("name code sections group level").sort({ sortOrder: 1, level: 1 }).lean(),
    Subject.find({ isActive: true }).select("name nameBn code classId group").sort({ sortOrder: 1 }).lean(),
    WebsitePerson.find({ status: "published" }).select("-__v").sort({ sortOrder: 1 }).lean(),
    WebsitePage.find({ status: "published" }).select("slug menuKey titleBn titleEn summaryBn summaryEn sortOrder").sort({ sortOrder: 1 }).lean(),
    WebsiteAlbum.find({ status: "published" }).select("titleBn titleEn kind coverUrl sortOrder").sort({ sortOrder: 1 }).lean(),
    WebsiteFile.find({ status: "published" }).select("kind titleBn titleEn classId academicYear filename size").sort({ createdAt: -1 }).lean(),
    WebsiteMedia.aggregate<{ _id: { albumId: unknown; kind: string }; n: number }>([
      { $match: { status: "published", kind: { $in: ["image", "video"] } } },
      { $group: { _id: { albumId: "$albumId", kind: "$kind" }, n: { $sum: 1 } } },
    ]),
    WebsiteMedia.find({ status: "published", kind: "video" })
      .select("albumId videoUrl alt captionBn captionEn")
      .sort({ createdAt: -1 })
      .limit(24)
      .lean(),
  ]);
  const subjectsByClass = new Map<string, Array<{ name: string; nameBn: string; code: string; group: string }>>();
  for (const subject of subjects) {
    const key = String(subject.classId);
    const list = subjectsByClass.get(key) ?? [];
    list.push({ name: subject.name, nameBn: subject.nameBn ?? "", code: subject.code, group: subject.group });
    subjectsByClass.set(key, list);
  }
  const imageCount = new Map<string, number>();
  const videoCount = new Map<string, number>();
  for (const row of albumCounts) {
    const key = String(row._id.albumId ?? "");
    if (row._id.kind === "video") videoCount.set(key, row.n);
    else imageCount.set(key, row.n);
  }
  const albumTitle = new Map(albums.map((album) => [String(album._id), album]));
  return {
    school: {
      name: settings?.name ?? "School",
      logoUrl: settings?.logoUrl ?? "",
      motto: settings?.motto ?? "",
      address: settings?.address ?? "",
      eiin: settings?.eiin ?? "",
      establishedYear: settings?.establishedYear ?? null,
      academicYear: settings?.academicYear ?? "",
    },
    config: {
      ...publicConfig((config ?? {}) as Record<string, unknown>),
      publicAdmission: normalizeModules(pack?.modules).publicAdmission,
    },
    notices: notices.slice(0, 8),
    posts,
    teachers,
    classes: classes.map((item) => ({
      _id: item._id,
      name: item.name,
      code: item.code,
      group: item.group,
      level: item.level,
      sections: sectionNames(item.sections),
      subjects: subjectsByClass.get(String(item._id)) ?? [],
    })),
    people,
    pages,
    albums: albums.map((album) => ({
      ...album,
      imageCount: imageCount.get(String(album._id)) ?? 0,
      videoCount: videoCount.get(String(album._id)) ?? 0,
    })),
    videos: videos.map((item) => {
      const album = albumTitle.get(String(item.albumId));
      return {
        _id: item._id,
        albumId: item.albumId,
        videoUrl: item.videoUrl,
        alt: item.alt,
        captionBn: item.captionBn,
        captionEn: item.captionEn,
        albumTitleBn: album?.titleBn ?? "",
        albumTitleEn: album?.titleEn ?? "",
      };
    }),
    files,
  };
}

export async function getPublicPage(slug: string | undefined) {
  await ensureWebsite();
  const page = await WebsitePage.findOne({ slug: routeParam(slug), status: "published" }).lean();
  if (!page) throw new ApiError(404, msg.notFoundRead("Page"));
  return page;
}

export async function getPublicPost(id: string | undefined) {
  if (!mongoose.isValidObjectId(String(id ?? ""))) throw new ApiError(404, msg.notFoundRead("Post"));
  const post = await WebsitePost.findOne({ _id: id, status: "published" }).lean();
  if (!post) throw new ApiError(404, msg.notFoundRead("Post"));
  return post;
}

export async function getPublicAlbum(id: string | undefined) {
  if (!mongoose.isValidObjectId(String(id ?? ""))) throw new ApiError(404, msg.notFoundRead("Album"));
  const album = await WebsiteAlbum.findOne({ _id: id, status: "published" }).lean();
  if (!album) throw new ApiError(404, msg.notFoundRead("Album"));
  const media = await WebsiteMedia.find({ albumId: id, status: "published" }).select("-__v").lean();
  return { album, media };
}

export async function getPublicRoutine(classId?: string, section?: string) {
  if (!classId || !mongoose.isValidObjectId(classId)) {
    throw new ApiError(400, msg.invalid("Routine", "Choose a class."));
  }
  const filter: Record<string, unknown> = { classId };
  if (section) filter.section = section;
  const slots = await Routine.find(filter)
    .populate("subjectId", "name nameBn")
    .populate("teacherId", "name")
    .sort({ day: 1, period: 1 })
    .lean();
  return slots.map((slot) => ({
    day: slot.day,
    period: slot.period,
    section: slot.section,
    subject: slot.subjectId,
    teacherName: slot.teacherId && typeof slot.teacherId === "object" && "name" in slot.teacherId ? String(slot.teacherId.name) : "",
  }));
}

export async function listPublicExams() {
  return ExamType.find({ isPublished: true }).select("name academicYear").sort({ academicYear: -1, name: 1 }).lean();
}

export async function lookupPublicResult(body: { studentId: string; examTypeId?: string }) {
  const config = await WebsiteConfig.findOne().select("resultLookupEnabled meritListEnabled").lean();
  if (config?.resultLookupEnabled === false) {
    throw new ApiError(403, "Result lookup is not open yet.");
  }
  const student = await Student.findOne({
    studentId: body.studentId.trim(),
    status: { $in: ["active", "alumni"] },
  })
    .select("name nameBn studentId rollNo section group academicYear classId guardian.fatherName guardian.motherName")
    .populate("classId", "name")
    .lean();
  if (!student) {
    throw new ApiError(404, RESULT_MISS);
  }
  const results = await Result.find({ studentId: student._id, deletedAt: null })
    .populate("examTypeId", "name isPublished academicYear")
    .populate("subjectMarks.subjectId", "name nameBn")
    .lean();
  const published = results.filter((item) => {
    const exam = item.examTypeId as unknown as { isPublished?: boolean; _id?: unknown } | null;
    if (!exam?.isPublished) return false;
    if (body.examTypeId && String(exam._id) !== body.examTypeId) return false;
    return true;
  });
  if (!published.length) throw new ApiError(404, RESULT_MISS);
  const klass = student.classId as unknown as { name?: string } | null;
  const guardian = student.guardian as { fatherName?: string; motherName?: string } | undefined;
  const showMerit = config?.meritListEnabled === true;
  return published.map((item) => {
    const exam = item.examTypeId as unknown as { name?: string; academicYear?: string };
    return {
      student: {
        name: student.name,
        nameBn: student.nameBn,
        studentId: student.studentId,
        rollNo: student.rollNo,
        section: student.section,
        group: student.group,
        academicYear: student.academicYear,
        className: klass?.name ?? "",
        fatherName: guardian?.fatherName ?? "",
        motherName: guardian?.motherName ?? "",
      },
      exam: { name: exam?.name ?? "", academicYear: exam?.academicYear ?? item.academicYear },
      gpa: item.gpa,
      letter: item.letter,
      totalObtained: item.totalObtained,
      totalFull: item.totalFull,
      academicYear: item.academicYear,
      meritPosition: showMerit ? item.meritPosition : null,
      subjects: item.subjectMarks.map((mark) => {
        const subject = mark.subjectId as unknown as { name?: string; nameBn?: string } | null;
        return {
          name: subject?.name ?? "",
          nameBn: subject?.nameBn ?? "",
          cq: mark.cq,
          mcq: mark.mcq,
          practical: mark.practical,
          attendance: mark.attendance,
          obtained: mark.obtained,
          full: mark.full,
          letter: mark.letter,
          gpa: mark.gpa,
        };
      }),
    };
  });
}

export async function publicMerit(examTypeId?: string, classId?: string) {
  const config = await configDoc();
  if (config.get("meritListEnabled") !== true) return { enabled: false, rows: [] };
  if (!examTypeId || !mongoose.isValidObjectId(examTypeId)) {
    throw new ApiError(400, msg.invalid("Merit list", "Choose a published exam."));
  }
  const exam = await ExamType.findOne({ _id: examTypeId, isPublished: true }).select("name");
  if (!exam) throw new ApiError(404, RESULT_MISS);
  const results = await Result.find({ examTypeId, deletedAt: null })
    .populate("studentId", "name rollNo section classId status")
    .sort({ meritPosition: 1, gpa: -1 })
    .limit(80);
  const rows = results
    .map((item) => {
      const student = item.studentId as unknown as { name?: string; rollNo?: string; section?: string; classId?: unknown; status?: string } | null;
      if (!student || (student.status !== "active" && student.status !== "alumni")) return null;
      if (classId && String(student.classId ?? "") !== classId) return null;
      return {
        name: student.name ?? "",
        rollNo: student.rollNo ?? "",
        section: student.section ?? "",
        gpa: item.gpa,
        letter: item.letter,
        meritPosition: item.meritPosition,
      };
    })
    .filter((row) => row !== null);
  return { enabled: true, exam: exam.name, rows };
}

export async function createInquiry(body: { name: string; phone?: string; email?: string; message: string; website?: string }) {
  if (body.website?.trim()) return { received: true };
  await WebsiteInquiry.create({
    name: body.name.trim(),
    phone: body.phone ?? "",
    email: body.email ?? "",
    message: body.message.trim(),
  });
  return { received: true };
}

export async function publicFile(id: string | undefined) {
  if (!mongoose.isValidObjectId(String(id ?? ""))) throw new ApiError(404, msg.notFoundRead("File"));
  const file = await WebsiteFile.findOne({ _id: id, status: "published" });
  if (!file) throw new ApiError(404, msg.notFoundRead("File"));
  return file;
}

function sectionNames(sections: unknown): string[] {
  if (!Array.isArray(sections)) return [];
  return sections
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "name" in item) return String((item as { name?: unknown }).name ?? "");
      return "";
    })
    .filter(Boolean);
}
