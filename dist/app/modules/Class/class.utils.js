"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asSections = asSections;
exports.sectionNames = sectionNames;
function asSections(raw) {
    if (!Array.isArray(raw) || raw.length === 0) {
        return [{ name: "A", capacity: 0 }];
    }
    return raw.map((item) => {
        if (typeof item === "string") {
            return { name: item, capacity: 0 };
        }
        const row = item;
        return {
            name: String(row.name ?? "A"),
            capacity: Number(row.capacity ?? 0),
            classTeacherId: row.classTeacherId,
        };
    });
}
function sectionNames(raw) {
    return asSections(raw).map((item) => item.name);
}
