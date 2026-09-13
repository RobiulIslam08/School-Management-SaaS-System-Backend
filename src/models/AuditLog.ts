import mongoose, { Schema } from "mongoose";

const auditSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
  },
  { timestamps: true, collection: "AuditLogs" }
);

auditSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditSchema);
