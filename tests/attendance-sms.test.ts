import { newlyAbsentStudentIds } from "../src/app/modules/Attendance/attendance.utils";
import { isoDate } from "../src/app/modules/Report/report.dashboard.utils";

describe("newlyAbsentStudentIds", () => {
  it("skips students who were already absent", () => {
    const ids = newlyAbsentStudentIds(
      [
        { studentId: "a", status: "absent" },
        { studentId: "b", status: "absent" },
        { studentId: "c", status: "present" },
      ],
      ["a"]
    );
    expect(ids).toEqual(["b"]);
  });
});

describe("isoDate", () => {
  it("uses the local calendar day", () => {
    const morning = new Date(2026, 9, 7, 1, 30, 0);
    expect(isoDate(morning)).toBe("2026-10-07");
  });
});
