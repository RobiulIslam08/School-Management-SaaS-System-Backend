import { asSections, sectionNames } from "../src/app/modules/Class/class.utils";
import { nextSortOrder } from "../src/app/modules/Subject/subject.utils";
import { trendPct } from "../src/app/modules/Report/report.dashboard.utils";

describe("class section helpers", () => {
  it("normalizes string sections from older documents", () => {
    expect(sectionNames(["A", "B"])).toEqual(["A", "B"]);
    expect(asSections(["A"])[0]).toMatchObject({ name: "A", capacity: 0 });
  });

  it("keeps structured sections", () => {
    expect(asSections([{ name: "Blue", capacity: 40 }])[0].name).toBe("Blue");
  });
});

describe("subject order", () => {
  it("increments sort order", () => {
    expect(nextSortOrder(2)).toBe(3);
    expect(nextSortOrder(undefined)).toBe(0);
  });
});

describe("dashboard trend", () => {
  it("computes percent change without dividing by zero", () => {
    expect(trendPct(10, 5)).toBe(100);
    expect(trendPct(4, 0)).toBe(100);
    expect(trendPct(0, 0)).toBe(0);
  });
});
