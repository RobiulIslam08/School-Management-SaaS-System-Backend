import {
  gpa5FromPercent,
  percentage,
  rankStudents,
  subjectResult,
  weightedFinal,
} from "../src/lib/grading";

describe("grading", () => {
  it("maps NCTB-style GPA 5.00 bands", () => {
    expect(gpa5FromPercent(80).gpa).toBe(5);
    expect(gpa5FromPercent(70).letter).toBe("A");
    expect(gpa5FromPercent(32).gpa).toBe(0);
  });

  it("computes percentage", () => {
    expect(percentage(80, 100)).toBe(80);
    expect(percentage(45, 60)).toBe(75);
  });

  it("rejects weights that do not sum to 100", () => {
    expect(() => weightedFinal([{ score: 80, weight: 40 }])).toThrow(/100/);
  });

  it("applies exam weights", () => {
    expect(
      weightedFinal([
        { score: 80, weight: 20 },
        { score: 70, weight: 30 },
        { score: 90, weight: 50 },
      ])
    ).toBe(82);
  });

  it("builds a subject result", () => {
    const result = subjectResult(
      { cq: 40, mcq: 20, practical: 15, attendance: 5 },
      { cq: 50, mcq: 25, practical: 20, attendance: 5 },
      "gpa5"
    );
    expect(result.obtained).toBe(80);
    expect(result.gpa).toBe(5);
  });

  it("breaks merit ties by configured fields", () => {
    const ranked = rankStudents(
      [
        { studentId: "b", totalMarks: 90, gpa: 5, cq: 40, attendance: 4 },
        { studentId: "a", totalMarks: 90, gpa: 5, cq: 45, attendance: 5 },
      ],
      ["totalMarks", "cq"]
    );
    expect(ranked[0].studentId).toBe("a");
  });
});
