"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureWebsite = ensureWebsite;
exports.getAdminBundle = getAdminBundle;
exports.saveConfig = saveConfig;
exports.createPage = createPage;
exports.updatePage = updatePage;
exports.deletePage = deletePage;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.createAlbum = createAlbum;
exports.updateAlbum = updateAlbum;
exports.deleteAlbum = deleteAlbum;
exports.createMedia = createMedia;
exports.deleteMedia = deleteMedia;
exports.createPerson = createPerson;
exports.updatePerson = updatePerson;
exports.deletePerson = deletePerson;
exports.createFile = createFile;
exports.deleteFile = deleteFile;
exports.markInquiry = markInquiry;
exports.invalidatePublicSiteCache = invalidatePublicSiteCache;
exports.getPublicSite = getPublicSite;
exports.getPublicPage = getPublicPage;
exports.getPublicPost = getPublicPost;
exports.getPublicAlbum = getPublicAlbum;
exports.getPublicRoutine = getPublicRoutine;
exports.listPublicExams = listPublicExams;
exports.lookupPublicResult = lookupPublicResult;
exports.lookupPublicReceipts = lookupPublicReceipts;
exports.publicMerit = publicMerit;
exports.createInquiry = createInquiry;
exports.publicFile = publicFile;
const mongoose_1 = __importDefault(require("mongoose"));
const ClassStructure_1 = require("../../../models/ClassStructure");
const FeaturePackage_1 = require("../../../models/FeaturePackage");
const ExamType_1 = require("../../../models/ExamType");
const Fee_1 = require("../../../models/Fee");
const Result_1 = require("../../../models/Result");
const Routine_1 = require("../../../models/Routine");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const Student_1 = require("../../../models/Student");
const Subject_1 = require("../../../models/Subject");
const Teacher_1 = require("../../../models/Teacher");
const Website_1 = require("../../../models/Website");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const notice_service_1 = require("../Notice/notice.service");
const website_defaults_1 = require("./website.defaults");
const notice_board_1 = require("../Notice/notice.board");
const website_showcase_1 = require("./website.showcase");
const website_guards_1 = require("./website.guards");
const website_receipts_1 = require("./website.receipts");
const website_theme_1 = require("./website.theme");
let ensuring = null;
async function ensureWebsite() {
    if (!ensuring) {
        ensuring = seedWebsiteIfEmpty().catch((error) => {
            ensuring = null;
            throw error;
        });
    }
    await ensuring;
}
async function seedWebsiteIfEmpty() {
    if (!(await Website_1.WebsiteConfig.exists({}))) {
        await Website_1.WebsiteConfig.create((0, website_defaults_1.defaultConfig)());
    }
    if (!(await Website_1.WebsitePage.exists({}))) {
        await Website_1.WebsitePage.insertMany((0, website_defaults_1.defaultPages)());
    }
    if (!(await Website_1.WebsitePost.exists({}))) {
        await Website_1.WebsitePost.insertMany((0, website_defaults_1.defaultPosts)());
    }
    await (0, website_showcase_1.ensureWebsiteShowcase)();
    await (0, notice_board_1.ensureNoticeBoard)();
}
const STORED_SEO_BN = "স্কুলের নোটিশ, ভর্তি, শিক্ষক, রুটিন ও প্রকাশিত ফলাফল দেখুন।";
const STORED_SEO_EN = "Notices, admission, teachers, routines, and published results for this school.";
function clipSeo(value) {
    const clean = value.replace(/\s+/g, " ").trim();
    if (clean.length <= 160)
        return clean;
    return `${clean.slice(0, 157).trimEnd()}...`;
}
function sideReady(value) {
    const clean = value.trim();
    return clean.length >= 50 && clean.length <= 160;
}
function fillSide(value, sources, fallback) {
    const clipped = clipSeo(value);
    if (sideReady(clipped))
        return clipped;
    const joined = clipSeo(sources.map((item) => item.replace(/\s+/g, " ").trim()).filter((item) => item.length >= 20).join(" "));
    if (sideReady(joined))
        return joined;
    const withFallback = clipSeo(`${joined} ${fallback}`.trim());
    return sideReady(withFallback) ? withFallback : fallback;
}
function readySeo(bn, en, bnSources, enSources) {
    if ((0, website_guards_1.seoLengthOk)(bn, en))
        return { bn: bn.trim(), en: en.trim() };
    const next = { bn: fillSide(bn, bnSources, STORED_SEO_BN), en: fillSide(en, enSources, STORED_SEO_EN) };
    return (0, website_guards_1.seoLengthOk)(next.bn, next.en) ? next : { bn: STORED_SEO_BN, en: STORED_SEO_EN };
}
function pageCopy(page, language) {
    const blocks = (page.blocks ?? []).flatMap((block) => (block.type === "list"
        ? (language === "bn" ? block.itemsBn : block.itemsEn) ?? []
        : [language === "bn" ? block.textBn ?? "" : block.textEn ?? ""]));
    return language === "bn"
        ? [page.titleBn ?? "", page.summaryBn ?? "", ...blocks]
        : [page.titleEn ?? "", page.summaryEn ?? "", ...blocks];
}
function assertSeo(status, bn, en, entity) {
    if (status !== "published")
        return;
    if (!(0, website_guards_1.seoLengthOk)(bn, en)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid(entity, "SEO description must be 50 to 160 characters before publishing."));
    }
}
function assertTitle(status, bn, en, entity) {
    if (status !== "published")
        return;
    if (!(bn.trim() || en.trim())) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid(entity, "A title is required to publish."));
    }
}
function assertOptionalImage(value, entity) {
    if (!value || (0, website_guards_1.isAllowedImage)(value))
        return;
    throw new ApiError_1.ApiError(400, messages_1.msg.invalid(entity, "Upload a JPEG, PNG, or WebP image."));
}
function assertBlocks(blocks, status) {
    for (const block of blocks ?? []) {
        if (block.type !== "image")
            continue;
        if (block.imageUrl)
            assertOptionalImage(block.imageUrl, "Page");
        if (status === "published" && block.imageUrl && !block.alt?.trim()) {
            throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Page", "Each published image needs a description."));
        }
    }
}
function cleanHttps(value, hosts, entity) {
    const raw = (value ?? "").trim();
    if (!raw)
        return "";
    let url;
    try {
        url = new URL(raw);
    }
    catch {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid(entity, "Use a full https link."));
    }
    if (url.protocol !== "https:") {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid(entity, "Use a full https link."));
    }
    if (hosts && !hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid(entity, "This link is not allowed."));
    }
    return url.toString();
}
function cleanMap(value) {
    const raw = (value ?? "").trim();
    if (!raw)
        return "";
    const iframe = /src=["']([^"']+)["']/.exec(raw);
    return cleanHttps(iframe?.[1] ?? raw, ["google.com", "google.com.bd", "openstreetmap.org"], "Map");
}
function lockMenus(menus) {
    const source = menus?.length ? menus : (0, website_defaults_1.defaultConfig)().menus;
    const locked = new Set(["home", "contact", "login"]);
    return (0, website_defaults_1.ensureLeadershipMenu)((0, website_defaults_1.ensureReceiptsMenu)(source.map((item) => (locked.has(item.key) ? { ...item, visible: true, locked: true } : item))));
}
function publicConfig(doc) {
    const theme = (0, website_theme_1.themeTokens)(String(doc.themePreset ?? "heritage"), String(doc.themePrimary ?? ""));
    const stats = Array.isArray(doc.stats)
        ? doc.stats.filter((item) => item && typeof item === "object" && String(item.value ?? "").trim())
        : [];
    const why = Array.isArray(doc.whyChooseUs)
        ? doc.whyChooseUs
            .filter((item) => {
            if (!item || typeof item !== "object")
                return false;
            const row = item;
            return Boolean(String(row.titleBn ?? "").trim() || String(row.titleEn ?? "").trim());
        })
            .slice(0, 6)
        : [];
    const admit = (0, website_defaults_1.defaultAdmit)();
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
        tasks: (0, website_defaults_1.publicTasks)(doc.tasks),
        admitTitleBn: doc.admitTitleBn || admit.admitTitleBn,
        admitTitleEn: doc.admitTitleEn || admit.admitTitleEn,
        admitBodyBn: doc.admitBodyBn || admit.admitBodyBn,
        admitBodyEn: doc.admitBodyEn || admit.admitBodyEn,
        desks: (0, website_defaults_1.publicDesks)(doc.desks),
        resultLookupEnabled: doc.resultLookupEnabled !== false,
        receiptLookupEnabled: doc.receiptLookupEnabled !== false,
        meritListEnabled: doc.meritListEnabled === true,
        seoDescriptionBn: doc.seoDescriptionBn ?? "",
        seoDescriptionEn: doc.seoDescriptionEn ?? "",
        menus: lockMenus(doc.menus),
    };
}
async function configDoc() {
    await ensureWebsite();
    const doc = await Website_1.WebsiteConfig.findOne();
    if (!doc)
        throw new ApiError_1.ApiError(500, messages_1.msg.server);
    return doc;
}
async function getAdminBundle() {
    await ensureWebsite();
    const [config, pages, posts, albums, media, people, files, inquiries] = await Promise.all([
        Website_1.WebsiteConfig.findOne().lean(),
        Website_1.WebsitePage.find().sort({ menuKey: 1, sortOrder: 1 }).lean(),
        Website_1.WebsitePost.find().sort({ pinned: -1, createdAt: -1 }).lean(),
        Website_1.WebsiteAlbum.find().sort({ sortOrder: 1, createdAt: -1 }).lean(),
        Website_1.WebsiteMedia.find().sort({ createdAt: -1 }).lean(),
        Website_1.WebsitePerson.find().sort({ board: 1, sortOrder: 1 }).lean(),
        Website_1.WebsiteFile.find().select("-data").sort({ createdAt: -1 }).lean(),
        Website_1.WebsiteInquiry.find().sort({ createdAt: -1 }).limit(100).lean(),
    ]);
    const configOut = config
        ? { ...config, menus: lockMenus(config.menus) }
        : config;
    return { config: configOut, pages, posts, albums, media, people, files, inquiries };
}
async function saveConfig(body) {
    const doc = await configDoc();
    assertOptionalImage(typeof body.heroImageUrl === "string" ? body.heroImageUrl : undefined, "Hero image");
    assertOptionalImage(typeof body.principalPhotoUrl === "string" ? body.principalPhotoUrl : undefined, "Principal photo");
    if (typeof body.heroVideoUrl === "string" && !(0, website_guards_1.isEmbedUrl)(body.heroVideoUrl)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Video", "Use a YouTube or Facebook link."));
    }
    const seo = readySeo(String(body.seoDescriptionBn ?? doc.get("seoDescriptionBn") ?? ""), String(body.seoDescriptionEn ?? doc.get("seoDescriptionEn") ?? ""), [String(body.heroTitleBn ?? ""), String(body.heroSubtitleBn ?? "")], [String(body.heroTitleEn ?? ""), String(body.heroSubtitleEn ?? "")]);
    body.seoDescriptionBn = seo.bn;
    body.seoDescriptionEn = seo.en;
    const next = {
        ...body,
        mapEmbedUrl: body.mapEmbedUrl !== undefined ? cleanMap(String(body.mapEmbedUrl ?? "")) : doc.get("mapEmbedUrl"),
        facebook: body.facebook !== undefined ? cleanHttps(String(body.facebook ?? ""), ["facebook.com", "fb.com"], "Facebook") : doc.get("facebook"),
        youtube: body.youtube !== undefined ? cleanHttps(String(body.youtube ?? ""), ["youtube.com", "youtu.be"], "YouTube") : doc.get("youtube"),
        menus: body.menus ? lockMenus(body.menus) : doc.get("menus"),
        whyChooseUs: Array.isArray(body.whyChooseUs)
            ? body.whyChooseUs
                .filter((item) => {
                if (!item || typeof item !== "object")
                    return false;
                const row = item;
                return Boolean(String(row.titleBn ?? "").trim() || String(row.titleEn ?? "").trim());
            })
                .slice(0, 6)
            : doc.get("whyChooseUs"),
        stats: Array.isArray(body.stats)
            ? body.stats
                .filter((item) => {
                if (!item || typeof item !== "object")
                    return false;
                const row = item;
                return Boolean(String(row.value ?? "").trim() || String(row.labelBn ?? "").trim() || String(row.labelEn ?? "").trim());
            })
                .slice(0, 8)
            : doc.get("stats"),
        tasks: Array.isArray(body.tasks) ? body.tasks.slice(0, 3) : doc.get("tasks"),
        desks: Array.isArray(body.desks) ? body.desks.slice(0, 16) : doc.get("desks"),
    };
    doc.set(next);
    await doc.save();
    return doc.toObject();
}
async function createPage(body) {
    assertTitle(body.status, body.titleBn ?? "", body.titleEn ?? "", "Page");
    if (body.status === "published") {
        const seo = readySeo(body.seoDescriptionBn ?? "", body.seoDescriptionEn ?? "", pageCopy(body, "bn"), pageCopy(body, "en"));
        body.seoDescriptionBn = seo.bn;
        body.seoDescriptionEn = seo.en;
    }
    assertSeo(body.status, body.seoDescriptionBn ?? "", body.seoDescriptionEn ?? "", "Page");
    assertBlocks(body.blocks, body.status);
    try {
        return await Website_1.WebsitePage.create(body);
    }
    catch (error) {
        if (error instanceof Error && "code" in error && error.code === 11000) {
            throw new ApiError_1.ApiError(409, messages_1.msg.duplicate("Page", "Slug"));
        }
        throw error;
    }
}
async function updatePage(id, body) {
    const page = await Website_1.WebsitePage.findById((0, persist_1.requireId)(id, "Page"));
    if (!page)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Page"));
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
async function deletePage(id) {
    const page = await Website_1.WebsitePage.findByIdAndDelete((0, persist_1.requireId)(id, "Page"));
    if (!page)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Page"));
    return { deleted: true };
}
async function createPost(body) {
    const status = String(body.status ?? "draft");
    assertTitle(status, String(body.titleBn ?? ""), String(body.titleEn ?? ""), "Post");
    if (status === "published") {
        const seo = readySeo(String(body.seoDescriptionBn ?? ""), String(body.seoDescriptionEn ?? ""), [String(body.titleBn ?? ""), String(body.bodyBn ?? "")], [String(body.titleEn ?? ""), String(body.bodyEn ?? "")]);
        body.seoDescriptionBn = seo.bn;
        body.seoDescriptionEn = seo.en;
    }
    assertSeo(status, String(body.seoDescriptionBn ?? ""), String(body.seoDescriptionEn ?? ""), "Post");
    assertOptionalImage(typeof body.coverUrl === "string" ? body.coverUrl : undefined, "Cover");
    if (status === "published" && body.coverUrl && !String(body.coverAlt ?? "").trim()) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Post", "A published cover image needs a description."));
    }
    return Website_1.WebsitePost.create(body);
}
async function updatePost(id, body) {
    const post = await Website_1.WebsitePost.findById((0, persist_1.requireId)(id, "Post"));
    if (!post)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Post"));
    post.set(body);
    const status = String(post.get("status") ?? "draft");
    assertTitle(status, String(post.get("titleBn") ?? ""), String(post.get("titleEn") ?? ""), "Post");
    if (status === "published") {
        const seo = readySeo(String(post.get("seoDescriptionBn") ?? ""), String(post.get("seoDescriptionEn") ?? ""), [String(post.get("titleBn") ?? ""), String(post.get("bodyBn") ?? "")], [String(post.get("titleEn") ?? ""), String(post.get("bodyEn") ?? "")]);
        post.set({ seoDescriptionBn: seo.bn, seoDescriptionEn: seo.en });
    }
    assertSeo(status, String(post.get("seoDescriptionBn") ?? ""), String(post.get("seoDescriptionEn") ?? ""), "Post");
    assertOptionalImage(String(post.get("coverUrl") ?? ""), "Cover");
    await post.save();
    return post;
}
async function deletePost(id) {
    const post = await Website_1.WebsitePost.findByIdAndDelete((0, persist_1.requireId)(id, "Post"));
    if (!post)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Post"));
    return { deleted: true };
}
async function createAlbum(body) {
    assertOptionalImage(typeof body.coverUrl === "string" ? body.coverUrl : undefined, "Album");
    return Website_1.WebsiteAlbum.create(body);
}
async function updateAlbum(id, body) {
    const album = await Website_1.WebsiteAlbum.findById((0, persist_1.requireId)(id, "Album"));
    if (!album)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Album"));
    assertOptionalImage(typeof body.coverUrl === "string" ? body.coverUrl : undefined, "Album");
    album.set(body);
    await album.save();
    return album;
}
async function deleteAlbum(id) {
    const albumId = (0, persist_1.requireId)(id, "Album");
    const album = await Website_1.WebsiteAlbum.findByIdAndDelete(albumId);
    if (!album)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Album"));
    await Website_1.WebsiteMedia.deleteMany({ albumId });
    return { deleted: true };
}
async function createMedia(body) {
    const kind = body.kind === "video" ? "video" : "image";
    const status = String(body.status ?? "draft");
    if (kind === "image") {
        assertOptionalImage(typeof body.url === "string" ? body.url : undefined, "Image");
        if (status === "published" && !String(body.alt ?? "").trim()) {
            throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Image", "A description is required before publishing."));
        }
    }
    else if (!(0, website_guards_1.isEmbedUrl)(String(body.videoUrl ?? ""))) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Video", "Use a YouTube or Facebook link."));
    }
    return Website_1.WebsiteMedia.create(body);
}
async function deleteMedia(id) {
    const media = await Website_1.WebsiteMedia.findByIdAndDelete((0, persist_1.requireId)(id, "Media"));
    if (!media)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Media"));
    return { deleted: true };
}
async function createPerson(body) {
    assertOptionalImage(typeof body.photoUrl === "string" ? body.photoUrl : undefined, "Photo");
    if (body.teacherId && mongoose_1.default.isValidObjectId(String(body.teacherId))) {
        const teacher = await Teacher_1.Teacher.findById(body.teacherId).select("name designation photoUrl");
        if (teacher) {
            body.name = body.name || teacher.name;
            body.designation = body.designation || teacher.designation;
            body.photoUrl = body.photoUrl || teacher.photoUrl;
        }
    }
    else {
        delete body.teacherId;
    }
    return Website_1.WebsitePerson.create(body);
}
async function updatePerson(id, body) {
    const person = await Website_1.WebsitePerson.findById((0, persist_1.requireId)(id, "Person"));
    if (!person)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Person"));
    assertOptionalImage(typeof body.photoUrl === "string" ? body.photoUrl : undefined, "Photo");
    person.set(body);
    await person.save();
    return person;
}
async function deletePerson(id) {
    const person = await Website_1.WebsitePerson.findByIdAndDelete((0, persist_1.requireId)(id, "Person"));
    if (!person)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Person"));
    return { deleted: true };
}
async function createFile(body) {
    let decoded;
    try {
        decoded = (0, website_guards_1.decodeMediaDataUrl)(body.dataUrl, "pdf");
    }
    catch (error) {
        const reason = error instanceof Error ? error.message : "Invalid file";
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("File", reason));
    }
    const title = (body.titleBn || body.titleEn || "").trim();
    if (!title)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("File", "A title is required."));
    return Website_1.WebsiteFile.create({
        kind: body.kind,
        titleBn: body.titleBn ?? "",
        titleEn: body.titleEn ?? "",
        classId: body.classId && mongoose_1.default.isValidObjectId(body.classId) ? body.classId : undefined,
        academicYear: body.academicYear ?? "",
        filename: (body.filename || "file.pdf").replace(/[^a-zA-Z0-9._-]/g, "") || "file.pdf",
        mime: decoded.mime,
        data: decoded.buffer,
        size: decoded.buffer.length,
        status: body.status === "draft" ? "draft" : "published",
    });
}
async function deleteFile(id) {
    const file = await Website_1.WebsiteFile.findByIdAndDelete((0, persist_1.requireId)(id, "File"));
    if (!file)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("File"));
    return { deleted: true };
}
async function markInquiry(id, read) {
    const inquiry = await Website_1.WebsiteInquiry.findById((0, persist_1.requireId)(id, "Inquiry"));
    if (!inquiry)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Inquiry"));
    inquiry.set("read", read);
    await inquiry.save();
    return inquiry;
}
let cachedSite = null;
function invalidatePublicSiteCache() {
    cachedSite = null;
}
async function getPublicSite() {
    const now = Date.now();
    if (cachedSite && cachedSite.expiresAt > now) {
        return cachedSite.data;
    }
    await ensureWebsite();
    const [settings, config, pack, notices, posts, teachers, classes, subjects, people, pages, albums, files, albumCounts, videos] = await Promise.all([
        SchoolSettings_1.SchoolSettings.findOne().select("name logoUrl motto address eiin establishedYear academicYear").lean(),
        Website_1.WebsiteConfig.findOne().lean(),
        FeaturePackage_1.FeaturePackage.findOne().select("modules").lean(),
        (0, notice_service_1.listPublicNotices)(),
        Website_1.WebsitePost.find({ status: "published" }).sort({ pinned: -1, eventDate: -1, createdAt: -1 }).limit(8).lean(),
        Teacher_1.Teacher.find({ isActive: true }).select("name designation photoUrl phone bioBn bioEn").sort({ name: 1 }).lean(),
        ClassStructure_1.ClassStructure.find({ isActive: true }).select("name code sections group level").sort({ sortOrder: 1, level: 1 }).lean(),
        Subject_1.Subject.find({ isActive: true }).select("name nameBn code classId group").sort({ sortOrder: 1 }).lean(),
        Website_1.WebsitePerson.find({ status: "published" }).select("-__v").sort({ sortOrder: 1 }).lean(),
        Website_1.WebsitePage.find({ status: "published" }).select("slug menuKey titleBn titleEn summaryBn summaryEn sortOrder").sort({ sortOrder: 1 }).lean(),
        Website_1.WebsiteAlbum.find({ status: "published" }).select("titleBn titleEn kind coverUrl sortOrder").sort({ sortOrder: 1 }).lean(),
        Website_1.WebsiteFile.find({ status: "published" }).select("kind titleBn titleEn classId academicYear filename size").sort({ createdAt: -1 }).lean(),
        Website_1.WebsiteMedia.aggregate([
            { $match: { status: "published", kind: { $in: ["image", "video"] } } },
            { $group: { _id: { albumId: "$albumId", kind: "$kind" }, n: { $sum: 1 } } },
        ]),
        Website_1.WebsiteMedia.find({ status: "published", kind: "video" })
            .select("albumId videoUrl alt captionBn captionEn")
            .sort({ createdAt: -1 })
            .limit(24)
            .lean(),
    ]);
    const subjectsByClass = new Map();
    for (const subject of subjects) {
        const key = String(subject.classId);
        const list = subjectsByClass.get(key) ?? [];
        list.push({ name: subject.name, nameBn: subject.nameBn ?? "", code: subject.code, group: subject.group });
        subjectsByClass.set(key, list);
    }
    const imageCount = new Map();
    const videoCount = new Map();
    for (const row of albumCounts) {
        const key = String(row._id.albumId ?? "");
        if (row._id.kind === "video")
            videoCount.set(key, row.n);
        else
            imageCount.set(key, row.n);
    }
    const albumTitle = new Map(albums.map((album) => [String(album._id), album]));
    const result = {
        school: {
            name: settings?.name ?? "School",
            logoUrl: settings?.logoUrl ?? "",
            motto: settings?.motto ?? "",
            address: settings?.address ?? "",
            eiin: settings?.eiin ?? "",
            establishedYear: settings?.establishedYear ?? null,
            academicYear: settings?.academicYear ?? "",
        },
        config: (() => {
            const modules = (0, FeaturePackage_1.normalizeModules)(pack?.modules);
            const pub = publicConfig((config ?? {}));
            const menus = modules.fees
                ? pub.menus
                : pub.menus.map((item) => item.key === "academic" ? { ...item, children: item.children.filter((child) => child.key !== "receipts") } : item);
            return {
                ...pub,
                menus,
                publicAdmission: modules.publicAdmission,
                receiptLookupEnabled: pub.receiptLookupEnabled && modules.fees,
            };
        })(),
        notices: notices.slice(0, 8),
        posts,
        teachers: teachers.map((row) => ({
            _id: row._id,
            name: row.name,
            designation: row.designation ?? "",
            photoUrl: row.photoUrl ?? "",
            phone: row.phone ?? "",
            bioBn: row.bioBn ?? "",
            bioEn: row.bioEn ?? "",
        })),
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
    cachedSite = { data: result, expiresAt: now + 60_000 };
    return result;
}
async function getPublicPage(slug) {
    await ensureWebsite();
    const page = await Website_1.WebsitePage.findOne({ slug: (0, persist_1.routeParam)(slug), status: "published" }).lean();
    if (!page)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Page"));
    return page;
}
async function getPublicPost(id) {
    if (!mongoose_1.default.isValidObjectId(String(id ?? "")))
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Post"));
    const post = await Website_1.WebsitePost.findOne({ _id: id, status: "published" }).lean();
    if (!post)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Post"));
    return post;
}
async function getPublicAlbum(id) {
    if (!mongoose_1.default.isValidObjectId(String(id ?? "")))
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Album"));
    const album = await Website_1.WebsiteAlbum.findOne({ _id: id, status: "published" }).lean();
    if (!album)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Album"));
    const media = await Website_1.WebsiteMedia.find({ albumId: id, status: "published" }).select("-__v").lean();
    return { album, media };
}
async function getPublicRoutine(classId, section) {
    if (!classId || !mongoose_1.default.isValidObjectId(classId)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Routine", "Choose a class."));
    }
    const filter = { classId };
    if (section)
        filter.section = section;
    const slots = await Routine_1.Routine.find(filter)
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
async function listPublicExams() {
    return ExamType_1.ExamType.find({ isPublished: true }).select("name academicYear").sort({ academicYear: -1, name: 1 }).lean();
}
async function lookupPublicResult(body) {
    const config = await Website_1.WebsiteConfig.findOne().select("resultLookupEnabled meritListEnabled").lean();
    if (config?.resultLookupEnabled === false) {
        throw new ApiError_1.ApiError(403, "Result lookup is not open yet.");
    }
    const student = await Student_1.Student.findOne({
        studentId: body.studentId.trim(),
        status: { $in: ["active", "alumni"] },
    })
        .select("name nameBn studentId rollNo section group academicYear classId guardian.fatherName guardian.motherName")
        .populate("classId", "name")
        .lean();
    if (!student) {
        throw new ApiError_1.ApiError(404, website_guards_1.RESULT_MISS);
    }
    const results = await Result_1.Result.find({ studentId: student._id, deletedAt: null })
        .populate("examTypeId", "name isPublished academicYear")
        .populate("subjectMarks.subjectId", "name nameBn")
        .lean();
    const published = results.filter((item) => {
        const exam = item.examTypeId;
        if (!exam?.isPublished)
            return false;
        if (body.examTypeId && String(exam._id) !== body.examTypeId)
            return false;
        return true;
    });
    if (!published.length)
        throw new ApiError_1.ApiError(404, website_guards_1.RESULT_MISS);
    const klass = student.classId;
    const guardian = student.guardian;
    const showMerit = config?.meritListEnabled === true;
    return published.map((item) => {
        const exam = item.examTypeId;
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
                const subject = mark.subjectId;
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
async function lookupPublicReceipts(body) {
    const pack = await FeaturePackage_1.FeaturePackage.findOne().select("modules").lean();
    if (!(0, FeaturePackage_1.normalizeModules)(pack?.modules).fees) {
        throw new ApiError_1.ApiError(403, "Receipt lookup is not open yet.");
    }
    const config = await Website_1.WebsiteConfig.findOne().select("receiptLookupEnabled").lean();
    if (config?.receiptLookupEnabled === false) {
        throw new ApiError_1.ApiError(403, "Receipt lookup is not open yet.");
    }
    const student = await Student_1.Student.findOne({
        studentId: body.studentId.trim(),
        status: { $in: ["active", "alumni"] },
    })
        .select("name nameBn studentId classId")
        .populate("classId", "name")
        .lean();
    if (!student)
        throw new ApiError_1.ApiError(404, website_receipts_1.RECEIPT_MISS);
    const ledgers = await Fee_1.FeeLedger.find({ studentId: student._id, deletedAt: null })
        .select("academicYear title payments.amount payments.method payments.refNo payments.receiptNo payments.date payments.particular")
        .lean();
    const sources = ledgers.flatMap((ledger) => {
        const payments = Array.isArray(ledger.payments) ? ledger.payments : [];
        return payments.map((payment) => ({
            ledgerId: String(ledger._id),
            academicYear: String(ledger.academicYear ?? ""),
            ledgerTitle: String(ledger.title ?? ""),
            paymentId: payment._id ? String(payment._id) : "",
            amount: Number(payment.amount ?? 0),
            method: String(payment.method ?? ""),
            refNo: String(payment.refNo ?? ""),
            receiptNo: String(payment.receiptNo ?? ""),
            date: payment.date ?? null,
            particular: String(payment.particular ?? ""),
        }));
    });
    const receipts = (0, website_receipts_1.groupPublicReceipts)(sources);
    if (!receipts.length)
        throw new ApiError_1.ApiError(404, website_receipts_1.RECEIPT_MISS);
    const klass = student.classId;
    return {
        student: {
            name: student.name,
            nameBn: student.nameBn ?? "",
            studentId: student.studentId,
            className: klass?.name ?? "",
        },
        receipts,
    };
}
async function publicMerit(examTypeId, classId) {
    const config = await configDoc();
    if (config.get("meritListEnabled") !== true)
        return { enabled: false, rows: [] };
    if (!examTypeId || !mongoose_1.default.isValidObjectId(examTypeId)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Merit list", "Choose a published exam."));
    }
    const exam = await ExamType_1.ExamType.findOne({ _id: examTypeId, isPublished: true }).select("name");
    if (!exam)
        throw new ApiError_1.ApiError(404, website_guards_1.RESULT_MISS);
    const results = await Result_1.Result.find({ examTypeId, deletedAt: null })
        .populate("studentId", "name rollNo section classId status")
        .sort({ meritPosition: 1, gpa: -1 })
        .limit(80);
    const rows = results
        .map((item) => {
        const student = item.studentId;
        if (!student || (student.status !== "active" && student.status !== "alumni"))
            return null;
        if (classId && String(student.classId ?? "") !== classId)
            return null;
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
async function createInquiry(body) {
    if (body.website?.trim())
        return { received: true };
    await Website_1.WebsiteInquiry.create({
        name: body.name.trim(),
        phone: body.phone ?? "",
        email: body.email ?? "",
        message: body.message.trim(),
    });
    return { received: true };
}
async function publicFile(id) {
    if (!mongoose_1.default.isValidObjectId(String(id ?? "")))
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("File"));
    const file = await Website_1.WebsiteFile.findOne({ _id: id, status: "published" });
    if (!file)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("File"));
    return file;
}
function sectionNames(sections) {
    if (!Array.isArray(sections))
        return [];
    return sections
        .map((item) => {
        if (typeof item === "string")
            return item;
        if (item && typeof item === "object" && "name" in item)
            return String(item.name ?? "");
        return "";
    })
        .filter(Boolean);
}
