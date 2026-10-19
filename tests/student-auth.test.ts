import { loginValidation } from "../src/app/modules/Auth/auth.validation";

describe("loginValidation credentials format", () => {
  it("accepts valid email credentials", () => {
    const result = loginValidation.safeParse({
      email: "admin@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts student ID credentials", () => {
    const result = loginValidation.safeParse({
      email: "121204",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("accepts phone number credentials", () => {
    const result = loginValidation.safeParse({
      email: "01712345678",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty identifier", () => {
    const result = loginValidation.safeParse({
      email: "",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginValidation.safeParse({
      email: "121204",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
