import { nextStudentIdFromExisting, STUDENT_ID_START } from "../src/app/modules/Student/student.utils";

describe("nextStudentIdFromExisting", () => {
  it("starts at 121201 when empty", () => {
    expect(nextStudentIdFromExisting([])).toBe("121201");
    expect(STUDENT_ID_START).toBe(121201);
  });

  it("increments from the highest ID in the series", () => {
    expect(nextStudentIdFromExisting(["121201"])).toBe("121202");
    expect(nextStudentIdFromExisting(["121205", "121201"])).toBe("121206");
  });

  it("ignores legacy non-numeric IDs", () => {
    expect(nextStudentIdFromExisting(["2026-GEN-001", "2026-VIII-002"])).toBe("121201");
    expect(nextStudentIdFromExisting(["2026-GEN-001", "121203"])).toBe("121204");
  });
});
