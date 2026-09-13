import mongoose, { Schema } from "mongoose";
import type { Role } from "../lib/permissions";

export interface UserDoc {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: Role;
  permissions: string[];
  totpSecret?: string;
  totpEnabled: boolean;
  linkedStudentId?: mongoose.Types.ObjectId;
  linkedTeacherId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["platform_owner", "school_admin", "teacher", "accountant", "guardian"],
    },
    permissions: { type: [String], default: [] },
    totpSecret: { type: String },
    totpEnabled: { type: Boolean, default: false },
    linkedStudentId: { type: Schema.Types.ObjectId, ref: "Student" },
    linkedTeacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ phone: 1 });

export const User = mongoose.model<UserDoc>("User", userSchema);
