import mongoose, { Schema } from "mongoose";

export const NOTICE_CATEGORIES = ["general", "exam", "holiday", "fee", "admission", "other"] as const;
export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export interface NoticeSignatory {
  name: string;
  designation: string;
}

const signatorySchema = new Schema<NoticeSignatory>(
  {
    name: { type: String, default: "" },
    designation: { type: String, default: "" },
  },
  { _id: false }
);

const noticeSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    audience: {
      type: String,
      enum: ["all", "teachers", "students", "guardians", "class"],
      default: "all",
    },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    isPublished: { type: Boolean, default: true },
    refNo: { type: String, default: "" },
    issueDate: { type: Date },
    category: {
      type: String,
      enum: NOTICE_CATEGORIES,
      default: "general",
    },
    signatories: { type: [signatorySchema], default: [] },
    showOnWebsite: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    createdByName: { type: String, default: "" },
  },
  { timestamps: true }
);

noticeSchema.index({ isPublished: 1, showOnWebsite: 1, pinned: -1, createdAt: -1 });
noticeSchema.index({ refNo: 1 });

export const Notice = mongoose.model("Notice", noticeSchema);

const smsLogSchema = new Schema(
  {
    to: { type: String, required: true },
    template: { type: String, default: "custom" },
    body: { type: String, required: true },
    status: { type: String, enum: ["queued", "sent", "failed"], default: "queued" },
    audience: { type: String, default: "" },
  },
  { timestamps: true, collection: "SMSLogs" }
);

export const SmsLog = mongoose.model("SmsLog", smsLogSchema);
