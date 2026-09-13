import mongoose, { Schema } from "mongoose";
import { CERTIFICATE_KINDS, type CertificateKind } from "../app/modules/Certificate/certificate.utils";

export interface CertificateTemplateDoc {
  kind: CertificateKind;
  name: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  isActive: boolean;
}

const templateSchema = new Schema<CertificateTemplateDoc>(
  {
    kind: { type: String, required: true, enum: CERTIFICATE_KINDS },
    name: { type: String, required: true, trim: true },
    titleBn: { type: String, required: true },
    titleEn: { type: String, required: true },
    bodyBn: { type: String, required: true },
    bodyEn: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "CertificateTemplates" }
);

templateSchema.index({ kind: 1, name: 1 }, { unique: true });

export const CertificateTemplate = mongoose.model<CertificateTemplateDoc>("CertificateTemplate", templateSchema);

export interface IssuedCertificateDoc {
  certNo: string;
  templateId: mongoose.Types.ObjectId;
  kind: CertificateKind;
  studentId: mongoose.Types.ObjectId;
  issueDate: Date;
  purpose: string;
  conduct: string;
  leavingDate?: Date;
  reason: string;
  language: "bn" | "en";
  issuedByName: string;
  renderedTitle: string;
  renderedBody: string;
  revokedAt?: Date | null;
}

const issuedSchema = new Schema<IssuedCertificateDoc>(
  {
    certNo: { type: String, required: true, unique: true },
    templateId: { type: Schema.Types.ObjectId, ref: "CertificateTemplate", required: true },
    kind: { type: String, required: true, enum: CERTIFICATE_KINDS },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    issueDate: { type: Date, required: true },
    purpose: { type: String, default: "" },
    conduct: { type: String, default: "good" },
    leavingDate: { type: Date },
    reason: { type: String, default: "" },
    language: { type: String, enum: ["bn", "en"], default: "bn" },
    issuedByName: { type: String, default: "" },
    renderedTitle: { type: String, required: true },
    renderedBody: { type: String, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "IssuedCertificates" }
);

issuedSchema.index({ studentId: 1, createdAt: -1 });
issuedSchema.index({ kind: 1, issueDate: -1 });
issuedSchema.index({ revokedAt: 1 });

export const IssuedCertificate = mongoose.model<IssuedCertificateDoc>("IssuedCertificate", issuedSchema);
