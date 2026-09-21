import { SmsLog } from "../../models/Notice";
import { SchoolSettings } from "../../models/SchoolSettings";
import { sendBulkSmsBd } from "./bulksmsbd";
import { normalizeBdPhone } from "./phone";

export type SmsSendSummary = {
  sent: number;
  failed: number;
  skipped: number;
  lastError?: string;
};

export type SmsDispatchItem = {
  to: string;
  body: string;
  template?: string;
  audience?: string;
};

export function emptySmsSummary(): SmsSendSummary {
  return { sent: 0, failed: 0, skipped: 0 };
}

export function smsNote(summary: SmsSendSummary): string {
  if (summary.sent > 0 && summary.failed === 0) return ` SMS sent: ${summary.sent}.`;
  if (summary.sent > 0) {
    const why = summary.lastError ? ` (${summary.lastError})` : "";
    return ` SMS sent: ${summary.sent}, failed: ${summary.failed}${why}.`;
  }
  if (summary.failed > 0) {
    const why = summary.lastError ? ` (${summary.lastError})` : "";
    return ` SMS failed: ${summary.failed}${why}.`;
  }
  if (summary.skipped > 0) return ` SMS skipped: ${summary.skipped} (no valid phone).`;
  return "";
}

async function loadSmsConfig() {
  const settings = await SchoolSettings.findOne();
  return {
    apiKey: settings?.smsApiKey?.trim() ?? "",
    senderId: settings?.smsSenderId?.trim() ?? "",
    schoolName: settings?.name?.trim() || "School",
    admissionEnabled: settings?.smsAdmissionEnabled !== false,
    attendanceEnabled: settings?.smsAttendanceEnabled !== false,
    payrollEnabled: settings?.smsPayrollEnabled !== false,
  };
}

export async function getSmsSchoolName(): Promise<string> {
  const cfg = await loadSmsConfig();
  return cfg.schoolName;
}

export async function isSmsTriggerEnabled(
  kind: "admission" | "attendance" | "payroll"
): Promise<boolean> {
  const cfg = await loadSmsConfig();
  if (!cfg.apiKey || !cfg.senderId) return false;
  if (kind === "admission") return cfg.admissionEnabled;
  if (kind === "attendance") return cfg.attendanceEnabled;
  return cfg.payrollEnabled;
}

/** Send one-or-many SMS via BulkSMSBD and persist SmsLog rows. Never throws. */
export async function dispatchSms(items: SmsDispatchItem[]): Promise<SmsSendSummary> {
  const summary = emptySmsSummary();
  if (!items.length) return summary;

  const cfg = await loadSmsConfig();
  const configured = Boolean(cfg.apiKey && cfg.senderId);

  for (const item of items) {
    const to = normalizeBdPhone(item.to) ?? item.to.trim();
    if (!to) {
      summary.skipped += 1;
      continue;
    }

    if (!configured) {
      const error = "SMS gateway not configured (API key or Sender ID missing)";
      await SmsLog.create({
        to,
        body: item.body,
        template: item.template ?? "custom",
        status: "failed",
        audience: item.audience ?? "",
        error,
      });
      summary.failed += 1;
      summary.lastError = error;
      continue;
    }

    const result = await sendBulkSmsBd({
      apiKey: cfg.apiKey,
      senderId: cfg.senderId,
      number: to,
      message: item.body,
    });

    await SmsLog.create({
      to,
      body: item.body,
      template: item.template ?? "custom",
      status: result.ok ? "sent" : "failed",
      audience: item.audience ?? "",
      error: result.ok ? "" : result.message,
    });

    if (result.ok) summary.sent += 1;
    else {
      summary.failed += 1;
      summary.lastError = result.message;
    }
  }

  return summary;
}
