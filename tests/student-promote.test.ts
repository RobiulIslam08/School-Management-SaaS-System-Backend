import { nextAcademicYear, planPromotion, type PromoteClass, type PromoteStudent } from "../src/app/modules/Student/student.promote";

const classes: PromoteClass[] = [
  { id: "c6", level: 6, group: "None", sections: ["A", "B"], active: true },
  { id: "c7", level: 7, group: "None", sections: ["A"], active: true },
  { id: "c8", level: 8, group: "None", sections: ["A", "B"], active: true },
  { id: "c9s", level: 9, group: "Science", sections: ["A"], active: true },
  { id: "c9b", level: 9, group: "Business", sections: ["A"], active: true },
  { id: "c10s", level: 10, group: "Science", sections: ["A", "B"], active: true },
];

function student(partial: Partial<PromoteStudent> & Pick<PromoteStudent, "id" | "classId">): PromoteStudent {
  return { section: "A", group: "None", ...partial };
}

describe("planPromotion", () => {
  it("moves a class up and keeps a section that exists", () => {
    const [decision] = planPromotion([student({ id: "s1", classId: "c6", section: "A" })], classes);
    expect(decision).toEqual({ kind: "move", studentId: "s1", classId: "c7", section: "A", group: "None" });
  });

  it("uses the first section when the current name is missing on the next class", () => {
    const [decision] = planPromotion([student({ id: "s1", classId: "c6", section: "B" })], classes);
    expect(decision).toMatchObject({ kind: "move", classId: "c7", section: "A" });
  });

  it("sends the highest class to alumni", () => {
    const [decision] = planPromotion([student({ id: "s1", classId: "c10s", group: "Science" })], classes);
    expect(decision).toEqual({ kind: "alumni", studentId: "s1" });
  });

  it("follows the student's group when the next level has several classes", () => {
    const [decision] = planPromotion([student({ id: "s1", classId: "c8", group: "Science" })], classes);
    expect(decision).toMatchObject({ kind: "move", classId: "c9s", group: "Science" });
  });

  it("skips a student when several next classes exist and none match", () => {
    const [decision] = planPromotion([student({ id: "s1", classId: "c8", group: "None" })], classes);
    expect(decision).toEqual({ kind: "skip", studentId: "s1" });
  });

  it("uses the only next class even when the group differs", () => {
    const roster = classes.map((item) => (item.id === "c10s" ? { ...item, group: "Humanities" } : item));
    const [decision] = planPromotion([student({ id: "s1", classId: "c9s", group: "Science", section: "B" })], roster);
    expect(decision).toEqual({ kind: "move", studentId: "s1", classId: "c10s", section: "B", group: "Humanities" });
  });
});

describe("nextAcademicYear", () => {
  it("increments a four-digit year and leaves other formats alone", () => {
    expect(nextAcademicYear("2026")).toBe("2027");
    expect(nextAcademicYear("2026-27")).toBeNull();
    expect(nextAcademicYear("")).toBeNull();
  });
});
