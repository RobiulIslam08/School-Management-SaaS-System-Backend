import {
  generateResetCode,
  isEligibleForPortal,
  isResetExpired,
  resetAttemptsExceeded,
  resetExpiresAt,
  RESET_MAX_ATTEMPTS,
  RESET_TTL_MS,
  shouldRevealDevCode,
} from "../src/app/modules/Auth/auth.utils";

describe("password reset helpers", () => {
  it("generates a 6-digit numeric code", () => {
    for (let i = 0; i < 20; i += 1) {
      expect(generateResetCode()).toMatch(/^\d{6}$/);
    }
  });

  it("expires after the ttl window", () => {
    const issued = new Date("2026-09-10T12:00:00.000Z");
    const expires = resetExpiresAt(issued);
    expect(expires.getTime() - issued.getTime()).toBe(RESET_TTL_MS);
    expect(isResetExpired(expires, new Date(issued.getTime() + RESET_TTL_MS - 1))).toBe(false);
    expect(isResetExpired(expires, new Date(issued.getTime() + RESET_TTL_MS))).toBe(true);
  });

  it("locks after too many attempts", () => {
    expect(resetAttemptsExceeded(RESET_MAX_ATTEMPTS - 1)).toBe(false);
    expect(resetAttemptsExceeded(RESET_MAX_ATTEMPTS)).toBe(true);
  });

  it("keeps owner reset on the owner portal only", () => {
    expect(isEligibleForPortal("platform_owner", true)).toBe(true);
    expect(isEligibleForPortal("platform_owner", false)).toBe(false);
    expect(isEligibleForPortal("school_admin", false)).toBe(true);
    expect(isEligibleForPortal("school_admin", true)).toBe(false);
  });

  it("never returns the reset code in production", () => {
    expect(shouldRevealDevCode("production")).toBe(false);
    expect(shouldRevealDevCode("development")).toBe(true);
  });
});
