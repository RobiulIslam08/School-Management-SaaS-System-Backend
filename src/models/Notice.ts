import mongoose, { Schema } from "mongoose";

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
  },
  { timestamps: true }
);

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
