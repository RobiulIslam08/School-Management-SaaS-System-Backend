export const RESULT_MISS = "No published result matched those details.";

const EMBED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "m.youtube.com",
  "facebook.com",
  "www.facebook.com",
  "fb.watch",
  "www.fb.watch",
]);

export function sameDob(stored: Date | string | null | undefined, input: string): boolean {
  if (!stored || !input) return false;
  const day = input.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = stored instanceof Date ? stored : new Date(stored);
  if (Number.isNaN(date.getTime())) return false;
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dateNum = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}-${dateNum}` === day;
}

export function isEmbedUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && EMBED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function seoLengthOk(bn: string, en: string): boolean {
  const bangla = bn.trim();
  const english = en.trim();
  const check = (value: string) => value.length >= 50 && value.length <= 160;
  if (!bangla && !english) return false;
  if (bangla && !check(bangla)) return false;
  if (english && !check(english)) return false;
  return true;
}

const MAX_BYTES = 8 * 1024 * 1024;

export function isAllowedImage(value: string): boolean {
  const raw = value.trim();
  if (!raw || raw.startsWith("https://")) return true;
  if (raw.startsWith("/") && !raw.includes("..") && !raw.includes("\\") && raw.length <= 240) return true;
  try {
    decodeMediaDataUrl(raw, "image");
    return true;
  } catch {
    return false;
  }
}

export function decodeMediaDataUrl(dataUrl: string, kind: "image" | "pdf"): { mime: string; buffer: Buffer } {
  const match = /^data:(application\/pdf|image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\r\n]+)$/.exec(dataUrl.trim());
  if (!match) {
    throw new Error("Upload a JPEG, PNG, WebP, or PDF file.");
  }
  const mime = match[1];
  if (kind === "pdf" && mime !== "application/pdf") {
    throw new Error("This file must be a PDF.");
  }
  if (kind === "image" && mime === "application/pdf") {
    throw new Error("This file must be a JPEG, PNG, or WebP image.");
  }
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > MAX_BYTES) {
    throw new Error("File must be under 8 MB.");
  }
  if (mime === "application/pdf" && buffer.subarray(0, 4).toString("utf8") !== "%PDF") {
    throw new Error("The PDF file is not valid.");
  }
  if (mime === "image/png" && buffer[0] !== 0x89) {
    throw new Error("The PNG file is not valid.");
  }
  if (mime === "image/jpeg" && (buffer[0] !== 0xff || buffer[1] !== 0xd8)) {
    throw new Error("The JPEG file is not valid.");
  }
  if (mime === "image/webp" && buffer.subarray(0, 4).toString("utf8") !== "RIFF") {
    throw new Error("The WebP file is not valid.");
  }
  return { mime, buffer };
}
