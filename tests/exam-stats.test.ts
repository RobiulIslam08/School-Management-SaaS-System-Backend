import {
  aggregateOverall,
  gpa5FromPercent,
  letterFromGpa,
  percentage,
  rankStudents,
} from "../src/lib/grading";

describe("exam pass/fail and statistics calculations", () => {
  it("determines pass status when gpa > 0 and no subject failed", () => {
    const passedSubjects = [
      { subjectId: "sub1", gpa: 4.0, obtained: 70, full: 100 },
      { subjectId: "sub2", gpa: 3.5, obtained: 65, full: 100 },
    ];
    const isPass = passedSubjects.every((m) => m.gpa > 0);
    expect(isPass).toBe(true);
  });

  it("determines fail status when any subject has gpa 0", () => {
    const mixedSubjects = [
      { subjectId: "sub1", gpa: 4.0, obtained: 70, full: 100 },
      { subjectId: "sub2", gpa: 0, obtained: 25, full: 100 },
    ];
    const isPass = mixedSubjects.every((m) => m.gpa > 0);
    expect(isPass).toBe(false);

    const failedSubjects = mixedSubjects.filter((m) => m.gpa === 0);
    expect(failedSubjects.length).toBe(1);
    expect(failedSubjects[0].subjectId).toBe("sub2");
  });

  it("correctly calculates pass rate and average percentage across student results", () => {
    const results = [
      { totalObtained: 80, totalFull: 100, gpa: 5.0, isPass: true },
      { totalObtained: 60, totalFull: 100, gpa: 3.5, isPass: true },
      { totalObtained: 30, totalFull: 100, gpa: 0.0, isPass: false },
      { totalObtained: 70, totalFull: 100, gpa: 4.0, isPass: true },
    ];

    const total = results.length;
    const passed = results.filter((r) => r.isPass).length;
    const failed = total - passed;
    const passRate = (passed / total) * 100;
    const avgGpa = results.reduce((sum, r) => sum + r.gpa, 0) / total;
    const avgPercent = results.reduce((sum, r) => sum + (r.totalObtained / r.totalFull) * 100, 0) / total;

    expect(total).toBe(4);
    expect(passed).toBe(3);
    expect(failed).toBe(1);
    expect(passRate).toBe(75);
    expect(avgGpa).toBe(3.125);
    expect(avgPercent).toBe(60);
  });

  it("handles empty results gracefully without division by zero", () => {
    const results: any[] = [];
    const total = results.length;
    const stats = total === 0 ? { total: 0, passed: 0, failed: 0, passRate: 0, avgGpa: 0, avgPercent: 0 } : null;
    expect(stats).toEqual({ total: 0, passed: 0, failed: 0, passRate: 0, avgGpa: 0, avgPercent: 0 });
  });
});
