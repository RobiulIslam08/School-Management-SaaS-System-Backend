"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceFilter = attendanceFilter;
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
