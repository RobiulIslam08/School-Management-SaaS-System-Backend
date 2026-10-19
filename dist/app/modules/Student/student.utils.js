"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStudentFilter = buildStudentFilter;
exports.batchYear = batchYear;
exports.siblingIndex = siblingIndex;
exports.studentIdPrefix = studentIdPrefix;
exports.nextSerialForPrefix = nextSerialForPrefix;
exports.formatStudentId = formatStudentId;
exports.prefixForClass = prefixForClass;
exports.nextStudentIdFromRoster = nextStudentIdFromRoster;
function buildStudentFilter(query) {
    const filter = {};
    if (query.classId)
        filter.classId = query.classId;
    if (query.section)
        filter.section = query.section;
    if (query.status)
        filter.status = query.status;
    if (query.district)
        filter["address.district"] = query.district;
    if (query.area)
        filter["address.area"] = query.area;
    if (query.tag)
        filter.talentTags = query.tag;
    if (query.q && typeof query.q === "string") {
        filter.$or = [
            { name: new RegExp(query.q, "i") },
            { nameBn: new RegExp(query.q, "i") },
            { studentId: new RegExp(query.q, "i") },
            { phone: new RegExp(query.q, "i") },
            { "guardian.phone": new RegExp(query.q, "i") },
        ];
    }
    return filter;
}
/** First 4-digit year in the batch label. `2026-27` stays `2026`. */
function batchYear(academicYear, now = new Date()) {
    const match = String(academicYear ?? "").match(/\d{4}/);
    return match?.[0] ?? String(now.getFullYear());
}
/** 1-based index among classes that share a level, sorted by code. Omitted when the level is unique. */
function siblingIndex(classes, classId) {
    const target = classes.find((row) => row.id === classId);
    if (!target)
        return undefined;
    const same = classes.filter((row) => row.level === target.level).sort((a, b) => a.code.localeCompare(b.code));
    if (same.length <= 1)
        return undefined;
    return same.findIndex((row) => row.id === classId) + 1;
}
/** `{level}{year}` or `{level}{sibling}{year}` when several classes share the level. */
function studentIdPrefix(level, year, sibling) {
    return sibling ? `${level}${sibling}${year}` : `${level}${year}`;
}
function nextSerialForPrefix(ids, prefix) {
    const pattern = new RegExp(`^${prefix}(\\d+)$`);
    let max = 0;
    for (const id of ids) {
        const match = pattern.exec(id);
        if (!match)
            continue;
        const serial = Number(match[1]);
        if (serial > max)
            max = serial;
    }
    return max + 1;
}
function formatStudentId(prefix, serial) {
    return `${prefix}${String(serial).padStart(3, "0")}`;
}
function prefixForClass(classes, classId, academicYear, now = new Date()) {
    const year = batchYear(academicYear, now);
    const target = classId ? classes.find((row) => row.id === classId) : undefined;
    const level = target?.level ?? 0;
    const sibling = classId ? siblingIndex(classes, classId) : undefined;
    return studentIdPrefix(level, year, sibling);
}
/** Class level + batch year + serial. Existing IDs outside that prefix are ignored. */
function nextStudentIdFromRoster(classes, classId, academicYear, existingIds, now = new Date()) {
    const prefix = prefixForClass(classes, classId, academicYear, now);
    return formatStudentId(prefix, nextSerialForPrefix(existingIds, prefix));
}
