"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStudentFilter = buildStudentFilter;
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
