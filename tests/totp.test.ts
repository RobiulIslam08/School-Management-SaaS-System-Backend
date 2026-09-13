import { generateOtpAuthUri, generateSecret, generateTotp, verifyTotp } from "../src/lib/totp";

describe("totp", () => {
  it("accepts the current code and rejects a wrong one", () => {
    const secret = generateSecret();
    const code = generateTotp(secret);
    expect(verifyTotp(secret, code)).toBe(true);
    expect(verifyTotp(secret, "000000")).toBe(false);
  });

  it("builds a Google Authenticator URI", () => {
    const uri = generateOtpAuthUri({
      issuer: "SchoolSaaS Owner",
      label: "owner@example.com",
      secret: "MFRGGZDFMZTWQ2LK",
    });
    expect(uri).toContain("otpauth://totp/");
    expect(uri).toContain("secret=MFRGGZDFMZTWQ2LK");
    expect(uri).toContain("owner%40example.com");
  });
});
