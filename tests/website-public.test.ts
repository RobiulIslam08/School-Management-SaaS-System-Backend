import { defaultDesks, defaultMenus, defaultPages, defaultTasks, ensureLeadershipMenu, ensureReceiptsMenu, publicDesks, publicTasks } from "../src/app/modules/Website/website.defaults";
import { RESULT_MISS, decodeMediaDataUrl, isAllowedImage, isEmbedUrl, sameDob, seoLengthOk } from "../src/app/modules/Website/website.guards";
import { RECEIPT_MISS, groupPublicReceipts, legacyReceiptNo, type ReceiptSource } from "../src/app/modules/Website/website.receipts";
import { contrastRatio, readableOn, themeTokens } from "../src/app/modules/Website/website.theme";

describe("website theme", () => {
  it("keeps white text on the heritage green", () => {
    const theme = themeTokens("heritage", "#ffffff");
    expect(theme.primary).toBe("#14532d");
    expect(theme.onPrimary).toBe("#ffffff");
    expect(contrastRatio("#ffffff", theme.primary)).toBeGreaterThanOrEqual(4.5);
  });

  it("uses ink on a pale custom colour", () => {
    expect(readableOn("#ffff00")).toBe("#111111");
    expect(contrastRatio("#111111", "#ffff00")).toBeGreaterThanOrEqual(4.5);
  });

  it("falls back when the custom colour is not a hex", () => {
    expect(themeTokens("custom", "green").primary).toBe("#14532d");
  });
});

describe("website guards", () => {
  it("matches a date of birth on the UTC calendar day", () => {
    expect(sameDob(new Date("2012-05-01T00:00:00.000Z"), "2012-05-01")).toBe(true);
    expect(sameDob(new Date("2012-05-01T00:00:00.000Z"), "2012-05-02")).toBe(false);
    expect(sameDob(undefined, "2012-05-01")).toBe(false);
  });

  it("uses one message for a missed result", () => {
    expect(RESULT_MISS).toBe("No published result matched those details.");
  });

  it("uses one message for a missed receipt", () => {
    expect(RECEIPT_MISS).toBe("No payment receipt matched those details.");
  });

  it("accepts YouTube and Facebook links only", () => {
    expect(isEmbedUrl("")).toBe(true);
    expect(isEmbedUrl("https://www.youtube.com/watch?v=abc")).toBe(true);
    expect(isEmbedUrl("https://youtu.be/abc")).toBe(true);
    expect(isEmbedUrl("http://www.youtube.com/watch?v=abc")).toBe(false);
    expect(isEmbedUrl("https://example.com/video")).toBe(false);
  });

  it("requires a 50 to 160 character SEO description", () => {
    const ok = "Read how the school was founded, who built it, and the years that shaped the campus.";
    expect(seoLengthOk(ok, "")).toBe(true);
    expect(seoLengthOk("too short", "")).toBe(false);
  });

  it("keeps a site photo path and rejects a path that escapes", () => {
    expect(isAllowedImage("/media/portrait-0.jpg")).toBe(true);
    expect(isAllowedImage("")).toBe(true);
    expect(isAllowedImage("../secret.jpg")).toBe(false);
  });

  it("rejects a PDF that is not a PDF", () => {
    const fake = `data:application/pdf;base64,${Buffer.from("hello").toString("base64")}`;
    expect(() => decodeMediaDataUrl(fake, "pdf")).toThrow(/not valid/);
  });

  it("publishes default pages with a usable SEO description", () => {
    for (const page of defaultPages()) {
      expect(seoLengthOk(page.seoDescriptionBn, page.seoDescriptionEn)).toBe(true);
    }
  });
});

describe("website copy", () => {
  it("keeps three home tasks and eleven desks (syndicate removed)", () => {
    expect(defaultTasks()).toHaveLength(3);
    const desks = defaultDesks();
    expect(desks).toHaveLength(11);
    expect(new Set(desks.map((desk) => desk.key)).size).toBe(11);
    expect(desks.some((desk) => desk.key === "committee")).toBe(true);
    expect(desks.some((desk) => desk.key === "syndicate")).toBe(false);
  });

  it("falls back when stored home tasks or desks are empty", () => {
    expect(publicTasks([])[0]?.titleBn).toBe(defaultTasks()[0]?.titleBn);
    expect(publicDesks([{ key: "principal", noteBn: "", dutiesBn: [] }])[0]?.noteBn).toBe(defaultDesks()[0]?.noteBn);
    expect(publicDesks([{ key: "principal", noteBn: "নিজের নোট", dutiesBn: ["এক"] }])[0]?.noteBn).toBe("নিজের নোট");
    expect(publicDesks([{ key: "vice", noteBn: "সহকারী প্রধান শিক্ষক রুটিন, উপস্থিতি ও শ্রেণি শিক্ষকদের সমন্বয় দেখেন। দেরির খাতা এই ডেস্কে।", noteEn: "The vice principal watches the routine, attendance, and class teachers. The late-arrival note stays at this desk." }]).find((desk) => desk.key === "vice")?.noteBn).toBe("সহকারি অধ্যক্ষ রুটিন, উপস্থিতি ও শ্রেণি শিক্ষকদের সমন্বয় দেখেন। দেরির খাতা এই ডেস্কে।");
  });

  it("places payment receipts after results and does not duplicate a hidden link", () => {
    const academic = defaultMenus().find((item) => item.key === "academic");
    const keys = academic?.children.map((child) => child.key) ?? [];
    expect(keys.indexOf("receipts")).toBe(keys.indexOf("results") + 1);

    const stripped = defaultMenus().map((item) =>
      item.key === "academic" ? { ...item, children: item.children.filter((child) => child.key !== "receipts") } : item
    );
    const inserted = ensureReceiptsMenu(stripped).find((item) => item.key === "academic");
    const insertedKeys = inserted?.children.map((child) => child.key) ?? [];
    expect(insertedKeys.indexOf("receipts")).toBe(insertedKeys.indexOf("results") + 1);

    const hidden = defaultMenus().map((item) =>
      item.key === "academic"
        ? { ...item, children: item.children.map((child) => (child.key === "receipts" ? { ...child, visible: false } : child)) }
        : item
    );
    const kept = ensureReceiptsMenu(hidden).find((item) => item.key === "academic");
    expect(kept?.children.find((child) => child.key === "receipts")?.visible).toBe(false);
  });

  it("adds the school committee once and renames the old assistant-principal label", () => {
    const authorities = defaultMenus().find((item) => item.key === "authorities");
    const keys = authorities?.children.map((child) => child.key) ?? [];
    expect(keys.indexOf("committee")).toBe(keys.indexOf("governing") - 1);
    expect(defaultMenus().find((item) => item.key === "office")?.children.find((child) => child.key === "vice")?.labelBn).toBe("সহকারি অধ্যক্ষ");
    expect(defaultDesks().some((desk) => desk.key === "committee")).toBe(true);

    const stripped = defaultMenus().map((item) =>
      item.key === "authorities" ? { ...item, children: item.children.filter((child) => child.key !== "committee") } : item
    );
    const inserted = ensureLeadershipMenu(stripped).find((item) => item.key === "authorities");
    expect(inserted?.children.filter((child) => child.key === "committee")).toHaveLength(1);

    const oldVice = defaultMenus().map((item) =>
      item.key === "office"
        ? {
            ...item,
            children: item.children.map((child) =>
              child.key === "vice" ? { ...child, labelBn: "সহকারী প্রধান শিক্ষক", labelEn: "Vice principal" } : child
            ),
          }
        : item
    );
    const renamed = ensureLeadershipMenu(oldVice).find((item) => item.key === "office");
    expect(renamed?.children.find((child) => child.key === "vice")).toMatchObject({
      labelBn: "সহকারি অধ্যক্ষ",
      labelEn: "Assistant principal",
    });

    const custom = ensureLeadershipMenu(defaultMenus()).find((item) => item.key === "authorities");
    expect(custom?.children.filter((child) => child.key === "committee")).toHaveLength(1);
  });
});

describe("public receipts", () => {
  const shared: ReceiptSource = {
    ledgerId: "ledger-a",
    academicYear: "2026",
    ledgerTitle: "Library Fee",
    paymentId: "pay-lib",
    amount: 100,
    method: "Cash",
    refNo: "",
    receiptNo: "FEE-1",
    date: "2026-09-02T00:00:00.000Z",
    particular: "Library Fee (Sep26)",
  };

  it("groups one receipt number, sorts heads, and leaves a line without a number on its own", () => {
    const rows = groupPublicReceipts([
      shared,
      {
        ...shared,
        ledgerId: "ledger-b",
        ledgerTitle: "Monthly Tuition Fee",
        paymentId: "pay-tui",
        amount: 500,
        refNo: "BK1",
        date: "2026-09-01T00:00:00.000Z",
        particular: "Monthly Tuition Fee (Sep26)",
      },
      {
        ledgerId: "ledger-c",
        academicYear: "2026",
        ledgerTitle: "Uniform",
        paymentId: "abcdef123456",
        amount: 200,
        method: "bKash",
        refNo: "TX9",
        receiptNo: "",
        date: "2026-10-01T00:00:00.000Z",
        particular: "",
      },
      {
        ...shared,
        ledgerId: "ledger-d",
        paymentId: "zero",
        amount: 0,
        receiptNo: "FEE-0",
        date: "2026-10-02T00:00:00.000Z",
        particular: "Zero",
      },
    ]);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.receiptNo).toBe(legacyReceiptNo("abcdef123456", "ledger-c", "2026-10-01T00:00:00.000Z"));
    expect(rows[0]?.lines).toEqual([{ title: "Uniform", amount: 200 }]);
    expect(rows[0]?.method).toBe("bKash");
    expect(rows[0]?.refNo).toBe("TX9");
    expect(rows[1]?.receiptNo).toBe("FEE-1");
    expect(rows[1]?.amount).toBe(600);
    expect(rows[1]?.method).toBe("Cash");
    expect(rows[1]?.refNo).toBe("");
    expect(rows[1]?.lines.map((line) => line.title)).toEqual(["Monthly Tuition Fee (Sep26)", "Library Fee (Sep26)"]);
  });
});
