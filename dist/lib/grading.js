"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalSubjectMarks = totalSubjectMarks;
exports.fullMarks = fullMarks;
exports.percentage = percentage;
exports.gpa5FromPercent = gpa5FromPercent;
exports.letterFromPercent = letterFromPercent;
exports.gradeForScale = gradeForScale;
exports.weightedFinal = weightedFinal;
exports.validateMarks = validateMarks;
exports.subjectResult = subjectResult;
exports.rankStudents = rankStudents;
exports.round2 = round2;
function totalSubjectMarks(marks) {
    return round2(marks.cq + marks.mcq + marks.practical + marks.attendance);
}
function fullMarks(caps) {
    return caps.cq + caps.mcq + caps.practical + caps.attendance;
}
function percentage(obtained, full) {
    if (full <= 0) {
        throw new Error("Full marks must be greater than 0");
    }
    return round2((obtained / full) * 100);
}
function gpa5FromPercent(p) {
    if (p >= 80)
        return { gpa: 5, letter: "A+" };
    if (p >= 70)
        return { gpa: 4, letter: "A" };
    if (p >= 60)
        return { gpa: 3.5, letter: "A-" };
    if (p >= 50)
        return { gpa: 3, letter: "B" };
    if (p >= 40)
        return { gpa: 2, letter: "C" };
    if (p >= 33)
        return { gpa: 1, letter: "D" };
    return { gpa: 0, letter: "F" };
}
function letterFromPercent(p) {
    return gpa5FromPercent(p).letter;
}
function gradeForScale(p, scale) {
    const band = gpa5FromPercent(p);
    if (scale === "percentage") {
        return { gpa: 0, letter: `${p}%`, percent: p };
    }
    if (scale === "letter") {
        return { gpa: 0, letter: band.letter, percent: p };
    }
    return { gpa: band.gpa, letter: band.letter, percent: p };
}
function weightedFinal(parts) {
    const weightSum = parts.reduce((sum, part) => sum + part.weight, 0);
    if (parts.length === 0) {
        throw new Error("Formula needs at least one exam weight");
    }
    if (Math.abs(weightSum - 100) > 0.001) {
        throw new Error("Exam weights must add up to 100");
    }
    return round2(parts.reduce((sum, part) => sum + (part.score * part.weight) / 100, 0));
}
function validateMarks(marks, caps) {
    Object.keys(caps).forEach((key) => {
        if (marks[key] < 0 || marks[key] > caps[key]) {
            throw new Error(`${key} must be between 0 and ${caps[key]}`);
        }
    });
}
function subjectResult(marks, caps, scale) {
    validateMarks(marks, caps);
    const obtained = totalSubjectMarks(marks);
    const p = percentage(obtained, fullMarks(caps));
    return { obtained, full: fullMarks(caps), ...gradeForScale(p, scale) };
}
function rankStudents(rows, tieBreak = ["totalMarks", "gpa", "cq"]) {
    return [...rows].sort((a, b) => {
        for (const field of tieBreak) {
            if (b[field] !== a[field])
                return b[field] - a[field];
        }
        return a.studentId.localeCompare(b.studentId);
    });
}
function round2(value) {
    return Math.round(value * 100) / 100;
}
