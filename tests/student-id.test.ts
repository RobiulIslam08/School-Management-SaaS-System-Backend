import {
  batchYear,
  nextStudentIdFromRoster,
  type ClassSerialRef,
} from "../src/app/modules/Student/student.utils";

const classes: ClassSerialRef[] = [
  { id: "c2", code: "C2", level: 2 },
  { id: "c3", code: "C3", level: 3 },
  { id: "bus", code: "C9-BUS", level: 9 },
  { id: "hum", code: "C9-HUM", level: 9 },
  { id: "sci", code: "C9-SCI", level: 9 },
  { id: "kg", code: "KG", level: 0 },
  { id: "nur", code: "NUR", level: 0 },
  { id: "play", code: "PLAY", level: 0 },
];

describe("class and batch student IDs", () => {
  it("reads the first 4-digit year from the batch label", () => {
    expect(batchYear("2026-27", new Date("2020-01-01"))).toBe("2026");
    expect(batchYear("", new Date("2024-06-01"))).toBe("2024");
  });

  it("starts each class and year at serial 001", () => {
    expect(nextStudentIdFromRoster(classes, "c2", "2026", [])).toBe("22026001");
    expect(nextStudentIdFromRoster(classes, "c3", "2026", ["22026001"])).toBe("32026001");
  });

  it("continues the serial for the same class and year only", () => {
    expect(nextStudentIdFromRoster(classes, "c2", "2026", ["22026001", "32026009", "121201"])).toBe("22026002");
    expect(nextStudentIdFromRoster(classes, "c2", "2027", ["22026005"])).toBe("22027001");
  });

  it("gives classes that share a level their own series, sorted by code", () => {
    expect(nextStudentIdFromRoster(classes, "bus", "2026", [])).toBe("912026001");
    expect(nextStudentIdFromRoster(classes, "hum", "2026", [])).toBe("922026001");
    expect(nextStudentIdFromRoster(classes, "sci", "2026", ["912026004"])).toBe("932026001");
    expect(nextStudentIdFromRoster(classes, "kg", "2026", [])).toBe("012026001");
    expect(nextStudentIdFromRoster(classes, "nur", "2026", [])).toBe("022026001");
    expect(nextStudentIdFromRoster(classes, "play", "2026", ["012026003"])).toBe("032026001");
  });
});
