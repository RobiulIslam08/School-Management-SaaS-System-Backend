import { isAllowedOrigin } from "../src/lib/cors-origin";

describe("isAllowedOrigin", () => {
  it("allows server-to-server requests with no Origin", () => {
    expect(isAllowedOrigin(undefined, "https://school.vercel.app")).toBe(true);
  });

  it("reflects the request origin when FRONTEND_ORIGIN is not set", () => {
    expect(isAllowedOrigin("https://school-web.vercel.app", "")).toBe("https://school-web.vercel.app");
  });

  it("allows only the configured frontend host", () => {
    expect(isAllowedOrigin("https://school-web.vercel.app", "https://school-web.vercel.app")).toBe(
      "https://school-web.vercel.app"
    );
    expect(isAllowedOrigin("https://other.vercel.app", "https://school-web.vercel.app")).toBe(false);
  });
});
