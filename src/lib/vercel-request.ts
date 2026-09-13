import type { IncomingMessage } from "http";
import type { Request } from "express";

function header(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name];
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Vercel rewrites every path to `/api`. Restore the public URL so Express
 * still sees `/health` and `/api/v1/...`.
 */
export function requestPathname(raw = "/"): string {
  try {
    return new URL(raw, "http://vercel.invalid").pathname;
  } catch {
    return raw.split("?")[0] || "/";
  }
}

export function restoreVercelUrl(req: IncomingMessage): void {
  const raw = req.url ?? "/";
  let url: URL;
  try {
    url = new URL(raw, "http://vercel.invalid");
  } catch {
    req.url = "/";
    return;
  }
  const injected = url.searchParams.get("__path");
  if (injected) {
    url.searchParams.delete("__path");
    const path = injected.startsWith("/") ? injected : `/${injected}`;
    const search = url.searchParams.toString();
    req.url = search ? `${path}?${search}` : path;
    return;
  }

  if (url.pathname !== "/api" && url.pathname !== "/api/") return;

  const forwarded = header(req, "x-forwarded-uri");
  if (!forwarded || forwarded === "/api" || forwarded === "/api/") return;

  if (forwarded.startsWith("http://") || forwarded.startsWith("https://")) {
    try {
      const abs = new URL(forwarded);
      req.url = `${abs.pathname}${abs.search}`;
    } catch {
      return;
    }
    return;
  }
  req.url = forwarded.startsWith("/") ? forwarded : `/${forwarded}`;
}

/** Vercel may already parse JSON; skip express.json so the body is not wiped. */
export function hasParsedJsonBody(req: Request): boolean {
  const body = req.body as unknown;
  if (body === undefined || body === null || body === "") return false;
  if (typeof body === "string") {
    try {
      req.body = JSON.parse(body) as Request["body"];
      return true;
    } catch {
      return false;
    }
  }
  return typeof body === "object" && !Buffer.isBuffer(body);
}
