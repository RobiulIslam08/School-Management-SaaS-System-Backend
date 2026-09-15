import { requestUrl, shouldSkipSessionRefresh } from "../../frontend/src/lib/session-refresh";

describe("session refresh skip list", () => {
  it("does not refresh login or refresh itself", () => {
    expect(shouldSkipSessionRefresh("/auth/login")).toBe(true);
    expect(shouldSkipSessionRefresh("/owner/login")).toBe(true);
    expect(shouldSkipSessionRefresh("/auth/refresh")).toBe(true);
    expect(shouldSkipSessionRefresh("/auth/logout")).toBe(true);
  });

  it("refreshes session-backed routes after a 401", () => {
    expect(shouldSkipSessionRefresh("/auth/me")).toBe(false);
    expect(shouldSkipSessionRefresh("/students")).toBe(false);
    expect(requestUrl({ url: "/auth/me" })).toBe("/auth/me");
  });
});
