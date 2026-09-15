import { resolveAppSecret } from "../src/config/secrets";

describe("resolveAppSecret", () => {
  it("uses the env value when set", () => {
    expect(
      resolveAppSecret({
        envValue: "from-env",
        name: "JWT_SECRET",
        isProduction: true,
        devFallback: "dev",
        mongoUri: "mongodb://example/db",
      })
    ).toBe("from-env");
  });

  it("uses the dev fallback outside production", () => {
    expect(
      resolveAppSecret({
        envValue: undefined,
        name: "JWT_SECRET",
        isProduction: false,
        devFallback: "dev-secret",
        mongoUri: "mongodb://example/db",
      })
    ).toBe("dev-secret");
  });

  it("stays stable across calls when production JWT env is missing", () => {
    const input = {
      envValue: undefined,
      name: "JWT_SECRET" as const,
      isProduction: true,
      devFallback: "dev",
      mongoUri: "mongodb://user:pass@example/school",
    };
    expect(resolveAppSecret(input)).toBe(resolveAppSecret(input));
    expect(resolveAppSecret({ ...input, name: "JWT_REFRESH_SECRET" })).not.toBe(resolveAppSecret(input));
  });
});
