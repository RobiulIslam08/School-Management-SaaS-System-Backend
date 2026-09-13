import { resolveGuardianStudentId } from "../src/app/modules/Public/public.utils";

describe("guardian portal student scope", () => {
  it("ignores query ids for guardians so they cannot open another child", () => {
    expect(resolveGuardianStudentId("guardian", "aaaaaaaaaaaaaaaaaaaaaaaa", "bbbbbbbbbbbbbbbbbbbbbbbb")).toBe(
      "aaaaaaaaaaaaaaaaaaaaaaaa"
    );
  });

  it("lets school staff preview a selected student", () => {
    expect(resolveGuardianStudentId("school_admin", undefined, "bbbbbbbbbbbbbbbbbbbbbbbb")).toBe(
      "bbbbbbbbbbbbbbbbbbbbbbbb"
    );
  });

  it("returns empty when a guardian has no linked student", () => {
    expect(resolveGuardianStudentId("guardian", undefined, "bbbbbbbbbbbbbbbbbbbbbbbb")).toBe("");
  });
});
