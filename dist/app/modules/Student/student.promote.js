"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextAcademicYear = nextAcademicYear;
exports.asGroup = asGroup;
exports.planPromotion = planPromotion;
function nextAcademicYear(current) {
    const trimmed = String(current ?? "").trim();
    if (!/^\d{4}$/.test(trimmed))
        return null;
    return String(Number(trimmed) + 1);
}
function asGroup(value) {
    if (value === "Science" || value === "Business" || value === "Humanities")
        return value;
    return "None";
}
function namedGroup(value) {
    const group = (value ?? "").trim();
    return group && group !== "None" ? group : "";
}
function pickSection(current, sections) {
    const names = sections.map((item) => item.trim()).filter(Boolean);
    if (current && names.includes(current))
        return current;
    return names[0] ?? "A";
}
function pickTarget(student, current, candidates) {
    if (candidates.length === 1)
        return candidates[0];
    const group = namedGroup(student.group) || namedGroup(current.group);
    if (!group)
        return null;
    const matched = candidates.filter((item) => namedGroup(item.group) === group);
    return matched.length === 1 ? matched[0] : null;
}
/** Maps each active student to the next class by level, or to alumni when no later class exists. */
function planPromotion(students, classes) {
    const byId = new Map(classes.map((item) => [item.id, item]));
    const levels = [...new Set(classes.filter((item) => item.active).map((item) => item.level))].sort((a, b) => a - b);
    return students.map((student) => {
        const current = byId.get(student.classId);
        if (!current)
            return { kind: "skip", studentId: student.id };
        const nextLevel = levels.find((level) => level > current.level);
        if (nextLevel == null)
            return { kind: "alumni", studentId: student.id };
        const candidates = classes.filter((item) => item.active && item.level === nextLevel);
        const target = pickTarget(student, current, candidates);
        if (!target)
            return { kind: "skip", studentId: student.id };
        return {
            kind: "move",
            studentId: student.id,
            classId: target.id,
            section: pickSection(student.section, target.sections),
            group: asGroup(namedGroup(target.group) || student.group),
        };
    });
}
