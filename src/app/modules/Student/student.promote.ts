export type PromoteGroup = "Science" | "Business" | "Humanities" | "None";

export type PromoteClass = {
  id: string;
  level: number;
  group: string;
  sections: string[];
  active: boolean;
};

export type PromoteStudent = {
  id: string;
  classId: string;
  section: string;
  group: string;
};

export type PromoteMove = {
  kind: "move";
  studentId: string;
  classId: string;
  section: string;
  group: PromoteGroup;
};

export type PromoteDecision =
  | PromoteMove
  | { kind: "alumni"; studentId: string }
  | { kind: "skip"; studentId: string };

export function nextAcademicYear(current: string | null | undefined): string | null {
  const trimmed = String(current ?? "").trim();
  if (!/^\d{4}$/.test(trimmed)) return null;
  return String(Number(trimmed) + 1);
}

export function asGroup(value: string | undefined): PromoteGroup {
  if (value === "Science" || value === "Business" || value === "Humanities") return value;
  return "None";
}

function namedGroup(value: string | undefined): string {
  const group = (value ?? "").trim();
  return group && group !== "None" ? group : "";
}

function pickSection(current: string, sections: string[]): string {
  const names = sections.map((item) => item.trim()).filter(Boolean);
  if (current && names.includes(current)) return current;
  return names[0] ?? "A";
}

function pickTarget(student: PromoteStudent, current: PromoteClass, candidates: PromoteClass[]): PromoteClass | null {
  if (candidates.length === 1) return candidates[0];
  const group = namedGroup(student.group) || namedGroup(current.group);
  if (!group) return null;
  const matched = candidates.filter((item) => namedGroup(item.group) === group);
  return matched.length === 1 ? matched[0] : null;
}

/** Maps each active student to the next class by level, or to alumni when no later class exists. */
export function planPromotion(students: PromoteStudent[], classes: PromoteClass[]): PromoteDecision[] {
  const byId = new Map(classes.map((item) => [item.id, item]));
  const levels = [...new Set(classes.filter((item) => item.active).map((item) => item.level))].sort((a, b) => a - b);

  return students.map((student) => {
    const current = byId.get(student.classId);
    if (!current) return { kind: "skip", studentId: student.id };
    const nextLevel = levels.find((level) => level > current.level);
    if (nextLevel == null) return { kind: "alumni", studentId: student.id };
    const candidates = classes.filter((item) => item.active && item.level === nextLevel);
    const target = pickTarget(student, current, candidates);
    if (!target) return { kind: "skip", studentId: student.id };
    return {
      kind: "move",
      studentId: student.id,
      classId: target.id,
      section: pickSection(student.section, target.sections),
      group: asGroup(namedGroup(target.group) || student.group),
    };
  });
}
