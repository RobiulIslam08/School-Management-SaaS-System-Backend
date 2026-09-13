import { escapeRegExp, fillPlaceholders, formatCertNo } from "../src/app/modules/Certificate/certificate.utils";

describe("certificate helpers", () => {
  it("builds a stable certificate number", () => {
    expect(formatCertNo("character", "2026", 7)).toBe("CHAR-2026-0007");
    expect(formatCertNo("transfer", "2026", 1)).toBe("TC-2026-0001");
  });

  it("escapes academic-year characters used in the register regex", () => {
    expect(escapeRegExp("2025-26")).toBe("2025-26");
    expect(escapeRegExp("2026.")).toBe("2026\\.");
  });

  it("fills merge fields and blanks missing ones", () => {
    const text = fillPlaceholders("{{ student_name }} of {{class}} — {{purpose}}", {
      student_name: "Rahim",
      class: "Class 8",
      purpose: "",
    });
    expect(text).toBe("Rahim of Class 8 — —");
  });
});
