"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteInquiry = exports.WebsiteFile = exports.WebsitePerson = exports.WebsiteMedia = exports.WebsiteAlbum = exports.WebsitePost = exports.WebsiteConfig = exports.WebsitePage = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const blockSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["paragraph", "list", "image", "heading"], required: true },
    textBn: { type: String, default: "" },
    textEn: { type: String, default: "" },
    itemsBn: { type: [String], default: [] },
    itemsEn: { type: [String], default: [] },
    imageUrl: { type: String, default: "" },
    alt: { type: String, default: "" },
}, { _id: false });
const pageSchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true, trim: true },
    menuKey: { type: String, required: true, trim: true },
    titleBn: { type: String, default: "" },
    titleEn: { type: String, default: "" },
    summaryBn: { type: String, default: "" },
    summaryEn: { type: String, default: "" },
    blocks: { type: [blockSchema], default: [] },
    seoDescriptionBn: { type: String, default: "" },
    seoDescriptionEn: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true, collection: "WebsitePages" });
const configSchema = new mongoose_1.Schema({
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    officeHours: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    themePreset: { type: String, default: "heritage" },
    themePrimary: { type: String, default: "#14532d" },
    heroTitleBn: { type: String, default: "" },
    heroTitleEn: { type: String, default: "" },
    heroSubtitleBn: { type: String, default: "" },
    heroSubtitleEn: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    heroVideoUrl: { type: String, default: "" },
    whyChooseUs: {
        type: [
            {
                titleBn: { type: String, default: "" },
                titleEn: { type: String, default: "" },
                bodyBn: { type: String, default: "" },
                bodyEn: { type: String, default: "" },
            },
        ],
        default: [],
    },
    stats: {
        type: [
            {
                labelBn: { type: String, default: "" },
                labelEn: { type: String, default: "" },
                value: { type: String, default: "" },
            },
        ],
        default: [],
    },
    principalName: { type: String, default: "" },
    principalDesignation: { type: String, default: "" },
    principalPhotoUrl: { type: String, default: "" },
    principalQuoteBn: { type: String, default: "" },
    principalQuoteEn: { type: String, default: "" },
    homeIntroBn: { type: String, default: "" },
    homeIntroEn: { type: String, default: "" },
    tasks: {
        type: [
            {
                titleBn: { type: String, default: "" },
                titleEn: { type: String, default: "" },
                bodyBn: { type: String, default: "" },
                bodyEn: { type: String, default: "" },
            },
        ],
        default: [],
    },
    admitTitleBn: { type: String, default: "" },
    admitTitleEn: { type: String, default: "" },
    admitBodyBn: { type: String, default: "" },
    admitBodyEn: { type: String, default: "" },
    desks: {
        type: [
            {
                key: { type: String, default: "" },
                noteBn: { type: String, default: "" },
                noteEn: { type: String, default: "" },
                dutiesBn: { type: [String], default: [] },
                dutiesEn: { type: [String], default: [] },
                visitBn: { type: [String], default: [] },
                visitEn: { type: [String], default: [] },
            },
        ],
        default: [],
    },
    resultLookupEnabled: { type: Boolean, default: true },
    receiptLookupEnabled: { type: Boolean, default: true },
    meritListEnabled: { type: Boolean, default: false },
    seoDescriptionBn: { type: String, default: "" },
    seoDescriptionEn: { type: String, default: "" },
    menus: { type: mongoose_1.Schema.Types.Mixed, default: [] },
}, { timestamps: true, collection: "WebsiteConfig" });
const postSchema = new mongoose_1.Schema({
    kind: { type: String, enum: ["news", "event", "program"], default: "news" },
    titleBn: { type: String, default: "" },
    titleEn: { type: String, default: "" },
    bodyBn: { type: String, default: "" },
    bodyEn: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    coverAlt: { type: String, default: "" },
    eventDate: { type: Date },
    pinned: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seoDescriptionBn: { type: String, default: "" },
    seoDescriptionEn: { type: String, default: "" },
}, { timestamps: true, collection: "WebsitePosts" });
const albumSchema = new mongoose_1.Schema({
    titleBn: { type: String, default: "" },
    titleEn: { type: String, default: "" },
    kind: { type: String, enum: ["campus", "cultural", "sports", "other"], default: "campus" },
    coverUrl: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true, collection: "WebsiteAlbums" });
const mediaSchema = new mongoose_1.Schema({
    albumId: { type: mongoose_1.Schema.Types.ObjectId, ref: "WebsiteAlbum" },
    kind: { type: String, enum: ["image", "video"], default: "image" },
    url: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    alt: { type: String, default: "" },
    captionBn: { type: String, default: "" },
    captionEn: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true, collection: "WebsiteMedia" });
const personSchema = new mongoose_1.Schema({
    board: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    bioBn: { type: String, default: "" },
    bioEn: { type: String, default: "" },
    phone: { type: String, default: "" },
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher" },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
}, { timestamps: true, collection: "WebsitePeople" });
const fileSchema = new mongoose_1.Schema({
    kind: { type: String, enum: ["syllabus", "routine", "prospectus", "form", "calendar"], required: true },
    titleBn: { type: String, default: "" },
    titleEn: { type: String, default: "" },
    classId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ClassStructure" },
    academicYear: { type: String, default: "" },
    filename: { type: String, default: "file.pdf" },
    mime: { type: String, default: "application/pdf" },
    data: { type: Buffer, required: true },
    size: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
}, { timestamps: true, collection: "WebsiteFiles" });
const inquirySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true, collection: "WebsiteInquiries" });
pageSchema.index({ menuKey: 1, status: 1, sortOrder: 1 });
postSchema.index({ status: 1, pinned: -1, createdAt: -1 });
mediaSchema.index({ albumId: 1, status: 1 });
exports.WebsitePage = mongoose_1.default.model("WebsitePage", pageSchema);
exports.WebsiteConfig = mongoose_1.default.model("WebsiteConfig", configSchema);
exports.WebsitePost = mongoose_1.default.model("WebsitePost", postSchema);
exports.WebsiteAlbum = mongoose_1.default.model("WebsiteAlbum", albumSchema);
exports.WebsiteMedia = mongoose_1.default.model("WebsiteMedia", mediaSchema);
exports.WebsitePerson = mongoose_1.default.model("WebsitePerson", personSchema);
exports.WebsiteFile = mongoose_1.default.model("WebsiteFile", fileSchema);
exports.WebsiteInquiry = mongoose_1.default.model("WebsiteInquiry", inquirySchema);
