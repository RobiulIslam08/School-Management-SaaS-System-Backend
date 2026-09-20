import { uniqueTopPerformers } from "../src/app/modules/Report/report.dashboard.utils";

describe("uniqueTopPerformers", () => {
  it("keeps one row per student using the first (highest GPA) result", () => {
    const rows = [
      { id: "a", name: "Ana", gpa: 5, studentId: "S1" },
      { id: "a", name: "Ana", gpa: 4.5, studentId: "S1" },
      { id: "b", name: "Ben", gpa: 4.8, studentId: "S2" },
    ];
    expect(uniqueTopPerformers(rows, 5)).toEqual([
      { id: "a", name: "Ana", gpa: 5, studentId: "S1" },
      { id: "b", name: "Ben", gpa: 4.8, studentId: "S2" },
    ]);
  });

  it("caps the list and skips nulls", () => {
    const rows = [
      null,
      { id: "a", name: "Ana", gpa: 5, studentId: "S1" },
      { id: "b", name: "Ben", gpa: 4, studentId: "S2" },
      { id: "c", name: "Cam", gpa: 3, studentId: "S3" },
    ];
    expect(uniqueTopPerformers(rows, 2).map((row) => row.id)).toEqual(["a", "b"]);
  });
});
