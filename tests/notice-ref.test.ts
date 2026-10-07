import { nextRefFromExisting } from "../src/app/modules/Notice/notice.service";

describe("nextRefFromExisting", () => {
  it("uses the highest number instead of the count after a gap", () => {
    expect(nextRefFromExisting("2026", ["NOT-2026-0001", "NOT-2026-0003"])).toBe("NOT-2026-0004");
  });
});
