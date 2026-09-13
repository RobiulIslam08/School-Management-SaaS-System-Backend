import mongoose, { Schema } from "mongoose";

export interface PasswordResetDoc {
  email: string;
  codeHash: string;
  expiresAt: Date;
  attemptCount: number;
  consumedAt?: Date | null;
  ownerPortal: boolean;
}

const passwordResetSchema = new Schema<PasswordResetDoc>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attemptCount: { type: Number, default: 0 },
    consumedAt: { type: Date, default: null },
    ownerPortal: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
passwordResetSchema.index({ email: 1, ownerPortal: 1, consumedAt: 1, createdAt: -1 });

export const PasswordReset = mongoose.model<PasswordResetDoc>("PasswordReset", passwordResetSchema);
