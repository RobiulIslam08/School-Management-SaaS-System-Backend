import mongoose, { Schema } from "mongoose";

export interface SchoolSettingsDoc {
  name: string;
  logoUrl: string;
  address: string;
  eiin: string;
  establishedYear: number | null;
  motto: string;
  theme: {
    primary: string;
    radius: string;
  };
  academicYear: string;
  smsApiKey: string;
  smsSenderId: string;
  smsAdmissionEnabled: boolean;
  smsAttendanceEnabled: boolean;
  smsPayrollEnabled: boolean;
  defaultLanguage: "bn" | "en";
}

const settingsSchema = new Schema<SchoolSettingsDoc>(
  {
    name: { type: String, required: true, default: "Your School" },
    logoUrl: { type: String, default: "" },
    address: { type: String, default: "" },
    eiin: { type: String, default: "" },
    establishedYear: { type: Number, default: null },
    motto: { type: String, default: "" },
    theme: {
      primary: { type: String, default: "#14532d" },
      radius: { type: String, default: "0.75rem" },
    },
    academicYear: { type: String, default: "2026" },
    smsApiKey: { type: String, default: "" },
    smsSenderId: { type: String, default: "" },
    smsAdmissionEnabled: { type: Boolean, default: true },
    smsAttendanceEnabled: { type: Boolean, default: true },
    smsPayrollEnabled: { type: Boolean, default: true },
    defaultLanguage: { type: String, enum: ["bn", "en"], default: "bn" },
  },
  { timestamps: true, collection: "SchoolSettings" }
);

export const SchoolSettings = mongoose.model<SchoolSettingsDoc>("SchoolSettings", settingsSchema);
