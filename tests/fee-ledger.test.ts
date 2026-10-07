import { aggregateFeesByClass, ledgerStatus, pickFeeLedger } from "../src/app/modules/Fee/fee.utils";

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

describe("aggregateFeesByClass", () => {
  it("rolls due and collected per class and counts unique students", () => {
    const rows = aggregateFeesByClass([
      {
        dueAmount: 1000,
        paidAmount: 200,
        discount: 0,
        studentId: { _id: "s1", classId: { _id: "c1", name: "Class 5" } },
      },
      {
        dueAmount: 500,
        paidAmount: 500,
        discount: 0,
        studentId: { _id: "s2", classId: { _id: "c1", name: "Class 5" } },
      },
      {
        dueAmount: 800,
        paidAmount: 0,
        discount: 0,
        studentId: { _id: "s3", classId: { _id: "c2", name: "Class 8" } },
      },
    ]);
    expect(rows).toEqual([
      { classId: "c1", name: "Class 5", due: 800, collected: 700, studentCount: 2 },
      { classId: "c2", name: "Class 8", due: 800, collected: 0, studentCount: 1 },
    ]);
  });

  it("groups ledgers without a class under a placeholder row", () => {
    const rows = aggregateFeesByClass([{ dueAmount: 100, paidAmount: 40, studentId: { _id: "s9" } }]);
    expect(rows).toEqual([{ classId: "none", name: "—", due: 60, collected: 40, studentCount: 1 }]);
  });
});

describe("pickFeeLedger", () => {
  const remaining = (row: { due: number }) => row.due;
  const open = [
    { title: "Monthly Tuition Fee (Aug26)", due: 500 },
    { title: "Monthly Tuition Fee", due: 300 },
    { title: "Library Fee (Sep26)", due: 100 },
  ];

  it("pays the same month and leaves a different month alone", () => {
    const chosen = pickFeeLedger(open, "Monthly Tuition Fee (Aug26)", 200, remaining);
    expect(chosen).toEqual({ kind: "pay", ledger: open[0] });
  });

  it("pays a bare head when that month has no ledger", () => {
    const chosen = pickFeeLedger(open, "Monthly Tuition Fee (Sep26)", 200, remaining);
    expect(chosen).toEqual({ kind: "pay", ledger: open[1] });
  });

  it("does not take another month when no bare ledger exists", () => {
    const chosen = pickFeeLedger(open, "Library Fee (Oct26)", 50, remaining);
    expect(chosen).toBeNull();
  });

  it("blocks a payment larger than the matching ledger", () => {
    const chosen = pickFeeLedger(open, "Library Fee (Sep26)", 150, remaining);
    expect(chosen).toEqual({ kind: "over", ledger: open[2] });
  });
});

