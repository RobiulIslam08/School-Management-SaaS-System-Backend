export type GradeScale = "gpa5" | "letter" | "percentage";

export interface SubjectMarksInput {
  cq: number;
  mcq: number;
  practical: number;
  attendance: number;
}

export interface MarkCaps {
  cq: number;
  mcq: number;
  practical: number;
  attendance: number;
}

export interface WeightedPart {
  score: number;
  weight: number;
}

export interface MeritRow {
  studentId: string;
  totalMarks: number;
  gpa: number;
  cq: number;
  attendance: number;
}

export type TieBreakField = "totalMarks" | "gpa" | "cq" | "attendance";

export function totalSubjectMarks(marks: SubjectMarksInput): number {
  return round2(marks.cq + marks.mcq + marks.practical + marks.attendance);
}

export function fullMarks(caps: MarkCaps): number {
  return caps.cq + caps.mcq + caps.practical + caps.attendance;
}

export function percentage(obtained: number, full: number): number {
  if (full <= 0) {
    throw new Error("Full marks must be greater than 0");
  }
  return round2((obtained / full) * 100);
}

export function gpa5FromPercent(p: number): { gpa: number; letter: string } {
  if (p >= 80) return { gpa: 5, letter: "A+" };
  if (p >= 70) return { gpa: 4, letter: "A" };
  if (p >= 60) return { gpa: 3.5, letter: "A-" };
  if (p >= 50) return { gpa: 3, letter: "B" };
  if (p >= 40) return { gpa: 2, letter: "C" };
  if (p >= 33) return { gpa: 1, letter: "D" };
  return { gpa: 0, letter: "F" };
}

export function letterFromPercent(p: number): string {
  return gpa5FromPercent(p).letter;
}

export function gradeForScale(p: number, scale: GradeScale): { gpa: number; letter: string; percent: number } {
  const band = gpa5FromPercent(p);
  if (scale === "percentage") {
    return { gpa: 0, letter: `${p}%`, percent: p };
  }
  if (scale === "letter") {
    return { gpa: 0, letter: band.letter, percent: p };
  }
  return { gpa: band.gpa, letter: band.letter, percent: p };
}

export function weightedFinal(parts: WeightedPart[]): number {
  const weightSum = parts.reduce((sum, part) => sum + part.weight, 0);
  if (parts.length === 0) {
    throw new Error("Formula needs at least one exam weight");
  }
  if (Math.abs(weightSum - 100) > 0.001) {
    throw new Error("Exam weights must add up to 100");
  }
  return round2(parts.reduce((sum, part) => sum + (part.score * part.weight) / 100, 0));
}

export function validateMarks(marks: SubjectMarksInput, caps: MarkCaps): void {
  (Object.keys(caps) as Array<keyof MarkCaps>).forEach((key) => {
    if (marks[key] < 0 || marks[key] > caps[key]) {
      throw new Error(`${key} must be between 0 and ${caps[key]}`);
    }
  });
}

export function subjectResult(marks: SubjectMarksInput, caps: MarkCaps, scale: GradeScale) {
  validateMarks(marks, caps);
  const obtained = totalSubjectMarks(marks);
  const p = percentage(obtained, fullMarks(caps));
  return { obtained, full: fullMarks(caps), ...gradeForScale(p, scale) };
}

export function rankStudents(rows: MeritRow[], tieBreak: TieBreakField[] = ["totalMarks", "gpa", "cq"]): MeritRow[] {
  return [...rows].sort((a, b) => {
    for (const field of tieBreak) {
      if (b[field] !== a[field]) return b[field] - a[field];
    }
    return a.studentId.localeCompare(b.studentId);
  });
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
