import type { CertificateKind } from "./certificate.utils";

export interface IssueCertificateBody {
  templateId: string;
  studentId: string;
  purpose?: string;
  conduct?: string;
  leavingDate?: string;
  reason?: string;
  language?: "bn" | "en";
}

export interface UpdateTemplateBody {
  name?: string;
  titleBn?: string;
  titleEn?: string;
  bodyBn?: string;
  bodyEn?: string;
  isActive?: boolean;
}
