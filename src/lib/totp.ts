import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateSecret(bytes = 20): string {
  return encodeBase32(randomBytes(bytes));
}

export function generateOtpAuthUri(params: { issuer: string; label: string; secret: string }): string {
  const issuer = encodeURIComponent(params.issuer);
  const label = encodeURIComponent(params.label);
  return `otpauth://totp/${issuer}:${label}?secret=${params.secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

export function generateTotp(secret: string, at = Date.now(), period = 30, digits = 6): string {
  const counter = Math.floor(at / 1000 / period);
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const key = Uint8Array.from(decodeBase32(secret));
  const hmac = createHmac("sha1", key).update(Uint8Array.from(buf)).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  return String(binary % 10 ** digits).padStart(digits, "0");
}

export function verifyTotp(secret: string, token: string, window = 1): boolean {
  const code = token.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(code)) return false;
  const now = Date.now();
  for (let i = -window; i <= window; i += 1) {
    if (codesEqual(generateTotp(secret, now + i * 30_000), code)) return true;
  }
  return false;
}

function codesEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  return timingSafeEqual(Uint8Array.from(Buffer.from(left)), Uint8Array.from(Buffer.from(right)));
}

function encodeBase32(buffer: Buffer): string {
  let bits = "";
  for (const byte of buffer) bits += byte.toString(2).padStart(8, "0");
  let out = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    out += ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  return out;
}

function decodeBase32(secret: string): Buffer {
  const clean = secret.replace(/=+$/g, "").replace(/\s+/g, "").toUpperCase();
  let bits = "";
  for (const char of clean) {
    const index = ALPHABET.indexOf(char);
    if (index === -1) continue;
    bits += index.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}
