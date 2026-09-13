import { ledgerStatus } from "../src/app/modules/Fee/fee.utils";

describe("fee ledger status", () => {
  it("marks paid when collection covers the due after discount", () => {
    expect(ledgerStatus(1000, 800, 200)).toBe("paid");
  });

  it("marks partial when some money is in", () => {
    expect(ledgerStatus(1000, 200, 0)).toBe("partial");
  });

  it("marks due when nothing is paid", () => {
    expect(ledgerStatus(1000, 0, 0)).toBe("due");
  });
});
