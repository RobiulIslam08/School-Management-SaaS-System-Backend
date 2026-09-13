import type { IncomingMessage } from "http";
import { restoreVercelUrl } from "../src/lib/vercel-request";

function fakeReq(url: string, headers: Record<string, string> = {}): IncomingMessage {
  return { url, headers } as IncomingMessage;
}

describe("restoreVercelUrl", () => {
  it("rebuilds the public path from the rewrite query", () => {
    const req = fakeReq("/api?__path=api/v1/auth/login&classId=6");
    restoreVercelUrl(req);
    expect(req.url).toBe("/api/v1/auth/login?classId=6");
  });

  it("restores /health from the rewrite query", () => {
    const req = fakeReq("/api?__path=health");
    restoreVercelUrl(req);
    expect(req.url).toBe("/health");
  });

  it("falls back to x-forwarded-uri when the path is only /api", () => {
    const req = fakeReq("/api", { "x-forwarded-uri": "/api/v1/students" });
    restoreVercelUrl(req);
    expect(req.url).toBe("/api/v1/students");
  });

  it("leaves a normal local URL alone", () => {
    const req = fakeReq("/api/v1/classes?section=A");
    restoreVercelUrl(req);
    expect(req.url).toBe("/api/v1/classes?section=A");
  });
});
