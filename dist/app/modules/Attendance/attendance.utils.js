"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newlyAbsentStudentIds = newlyAbsentStudentIds;
exports.attendanceFilter = attendanceFilter;
/** Students marked absent now who were not already absent on this date. */
function newlyAbsentStudentIds(entries, alreadyAbsent) {
    const prior = new Set([...alreadyAbsent].map(String));
    return entries
        .filter((entry) => entry.status === "absent" && !prior.has(String(entry.studentId)))
        .map((entry) => entry.studentId);
}
function attendanceFilter(query) {
    const filter = {};
    if (query.classId)
        filter.classId = query.classId;
    if (query.section)
        filter.section = query.section;
    if (query.date)
        filter.date = query.date;
    if (query.studentId)
        filter.studentId = query.studentId;
    return filter;
}
