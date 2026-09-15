import { duplicateExamLabels, examNameKey } from "../../frontend/src/lib/exam-names";

describe("exam name duplicates", () => {
  it("treats Final Exam and ফাইনাল as the same exam", () => {
    expect(examNameKey("Final Exam")).toBe("final");
    expect(examNameKey("ফাইনাল")).toBe("final");
    expect(duplicateExamLabels([{ name: "Final Exam" }, { name: "ফাইনাল" }])).toEqual(["Final Exam / ফাইনাল"]);
  });

  it("does not warn when names are distinct", () => {
    expect(duplicateExamLabels([{ name: "First term" }, { name: "Final Exam" }])).toEqual([]);
  });
});
