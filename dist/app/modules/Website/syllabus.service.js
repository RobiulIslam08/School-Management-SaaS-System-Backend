"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSyllabus = listSyllabus;
exports.upsertSyllabus = upsertSyllabus;
exports.publicSyllabus = publicSyllabus;
const mongoose_1 = __importDefault(require("mongoose"));
const Syllabus_1 = require("../../../models/Syllabus");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
function requireClassId(classId) {
    if (!classId || !mongoose_1.default.isValidObjectId(classId)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Syllabus", "Choose a class."));
    }
    return classId;
}
function chapterLines(values) {
    return values.map((item) => item.trim()).filter(Boolean).slice(0, 12);
}
async function listSyllabus(classId) {
    const id = requireClassId(classId);
    return Syllabus_1.SyllabusOutline.find({ classId: id })
        .populate("subjectId", "name nameBn code")
        .sort({ academicYear: -1 })
        .lean();
}
async function upsertSyllabus(body) {
    if (!mongoose_1.default.isValidObjectId(body.classId) || !mongoose_1.default.isValidObjectId(body.subjectId)) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Syllabus", "Choose a class and a subject."));
    }
    const chaptersBn = chapterLines(body.chaptersBn ?? []);
    const chaptersEn = chapterLines(body.chaptersEn ?? []);
    if (!chaptersBn.length && !chaptersEn.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Syllabus", "Add at least one chapter."));
    }
    return Syllabus_1.SyllabusOutline.findOneAndUpdate({ classId: body.classId, subjectId: body.subjectId, academicYear: (body.academicYear ?? "").trim() }, { $set: { chaptersBn, chaptersEn } }, { upsert: true, new: true });
}
async function publicSyllabus(classId) {
    const rows = await listSyllabus(classId);
    const seen = new Set();
    const outlines = [];
    for (const row of rows) {
        const subject = row.subjectId;
        const subjectId = subject && typeof subject === "object" && "_id" in subject ? String(subject._id) : String(subject);
        if (seen.has(subjectId))
            continue;
        seen.add(subjectId);
        const named = subject && typeof subject === "object" ? subject : null;
        outlines.push({
            _id: row._id,
            subjectId,
            name: named && "name" in named ? String(named.name ?? "") : "",
            nameBn: named && "nameBn" in named ? String(named.nameBn ?? "") : "",
            academicYear: row.academicYear,
            chaptersBn: row.chaptersBn,
            chaptersEn: row.chaptersEn,
        });
    }
    return outlines;
}
