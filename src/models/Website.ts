import mongoose, { Schema } from "mongoose";

const blockSchema = new Schema(
  {
    type: { type: String, enum: ["paragraph", "list", "image", "heading"], required: true },
    textBn: { type: String, default: "" },
    textEn: { type: String, default: "" },
    itemsBn: { type: [String], default: [] },
    itemsEn: { type: [String], default: [] },
    imageUrl: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const pageSchema = new Schema(
  {
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
  },
  { timestamps: true, collection: "WebsitePages" }
);

const configSchema = new Schema(
  {
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
    meritListEnabled: { type: Boolean, default: false },
    seoDescriptionBn: { type: String, default: "" },
    seoDescriptionEn: { type: String, default: "" },
    menus: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true, collection: "WebsiteConfig" }
);

const postSchema = new Schema(
  {
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
  },
  { timestamps: true, collection: "WebsitePosts" }
);

const albumSchema = new Schema(
  {
    titleBn: { type: String, default: "" },
    titleEn: { type: String, default: "" },
    kind: { type: String, enum: ["campus", "cultural", "sports", "other"], default: "campus" },
    coverUrl: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "WebsiteAlbums" }
);

const mediaSchema = new Schema(
  {
    albumId: { type: Schema.Types.ObjectId, ref: "WebsiteAlbum" },
    kind: { type: String, enum: ["image", "video"], default: "image" },
    url: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    alt: { type: String, default: "" },
    captionBn: { type: String, default: "" },
    captionEn: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true, collection: "WebsiteMedia" }
);

const personSchema = new Schema(
  {
    board: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    bioBn: { type: String, default: "" },
    bioEn: { type: String, default: "" },
    phone: { type: String, default: "" },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true, collection: "WebsitePeople" }
);

const fileSchema = new Schema(
  {
    kind: { type: String, enum: ["syllabus", "routine", "prospectus", "form", "calendar"], required: true },
    titleBn: { type: String, default: "" },
    titleEn: { type: String, default: "" },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    academicYear: { type: String, default: "" },
    filename: { type: String, default: "file.pdf" },
    mime: { type: String, default: "application/pdf" },
    data: { type: Buffer, required: true },
    size: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true, collection: "WebsiteFiles" }
);

const inquirySchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "WebsiteInquiries" }
);

pageSchema.index({ menuKey: 1, status: 1, sortOrder: 1 });
postSchema.index({ status: 1, pinned: -1, createdAt: -1 });
mediaSchema.index({ albumId: 1, status: 1 });

export const WebsitePage = mongoose.model("WebsitePage", pageSchema);
export const WebsiteConfig = mongoose.model("WebsiteConfig", configSchema);
export const WebsitePost = mongoose.model("WebsitePost", postSchema);
export const WebsiteAlbum = mongoose.model("WebsiteAlbum", albumSchema);
export const WebsiteMedia = mongoose.model("WebsiteMedia", mediaSchema);
export const WebsitePerson = mongoose.model("WebsitePerson", personSchema);
export const WebsiteFile = mongoose.model("WebsiteFile", fileSchema);
export const WebsiteInquiry = mongoose.model("WebsiteInquiry", inquirySchema);
