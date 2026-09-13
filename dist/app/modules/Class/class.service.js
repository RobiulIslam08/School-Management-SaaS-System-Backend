"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClasses = listClasses;
exports.createClass = createClass;
exports.updateClass = updateClass;
exports.archiveClass = archiveClass;
exports.deleteClass = deleteClass;
exports.upsertSection = upsertSection;
exports.removeSection = removeSection;
exports.classWorkspace = classWorkspace;
const ClassStructure_1 = require("../../../models/ClassStructure");
const Student_1 = require("../../../models/Student");
const Subject_1 = require("../../../models/Subject");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const class_utils_1 = require("./class.utils");
async function listClasses() {
    const items = await ClassStructure_1.ClassStructure.find().sort({ sortOrder: 1, level: 1, name: 1 });
    return items.map((item) => {
        const json = item.toObject();
        return { ...json, sections: (0, class_utils_1.asSections)(json.sections) };
    });
}
async function createClass(body) {
    return ClassStructure_1.ClassStructure.create({
        ...body,
        sortOrder: body.sortOrder ?? body.level,
        sections: (0, class_utils_1.asSections)(body.sections),
    });
}
async function updateClass(id, body) {
    const payload = body && typeof body === "object" ? { ...body } : body;
    if (payload && typeof payload === "object" && "sections" in payload) {
        payload.sections = (0, class_utils_1.asSections)(payload.sections);
    }
    return (0, persist_1.updateDocument)(ClassStructure_1.ClassStructure, id, payload, "Class");
}
async function archiveClass(id) {
    const recordId = (0, persist_1.requireId)(id, "Class");
    const enrolled = await Student_1.Student.countDocuments({ classId: recordId, status: "active" });
    const item = await ClassStructure_1.ClassStructure.findById(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Class"));
    item.isActive = false;
    await item.save();
    return { ...item.toObject(), enrolled };
}
async function deleteClass(id) {
    const recordId = (0, persist_1.requireId)(id, "Class");
    const enrolled = await Student_1.Student.countDocuments({ classId: recordId, status: "active" });
    if (enrolled > 0) {
        throw new ApiError_1.ApiError(409, messages_1.msg.invalid("Class", "Active students are still enrolled in this class."));
    }
    const item = await ClassStructure_1.ClassStructure.findByIdAndDelete(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Class"));
    return { deleted: true };
}
async function upsertSection(id, body, previousName) {
    const recordId = (0, persist_1.requireId)(id, "Class");
    const item = await ClassStructure_1.ClassStructure.findById(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Class"));
    const sections = (0, class_utils_1.asSections)(item.sections);
    const key = previousName ?? body.name;
    const index = sections.findIndex((row) => row.name === key);
    const next = {
        name: body.name,
        capacity: body.capacity ?? 0,
        classTeacherId: body.classTeacherId,
    };
    if (index >= 0)
        sections[index] = next;
    else
        sections.push(next);
    item.sections = sections;
    await item.save();
    return item;
}
async function removeSection(id, name) {
    const recordId = (0, persist_1.requireId)(id, "Class");
    const enrolled = await Student_1.Student.countDocuments({ classId: recordId, section: name, status: "active" });
    if (enrolled > 0) {
        throw new ApiError_1.ApiError(409, messages_1.msg.invalid("Section", "Active students are still in this section."));
    }
    const item = await ClassStructure_1.ClassStructure.findById(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Class"));
    item.sections = (0, class_utils_1.asSections)(item.sections).filter((row) => row.name !== name);
    await item.save();
    return item;
}
async function classWorkspace(id) {
    const recordId = (0, persist_1.requireId)(id, "Class");
    const item = await ClassStructure_1.ClassStructure.findById(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Class"));
    const sections = (0, class_utils_1.asSections)(item.sections);
    const [students, subjects] = await Promise.all([
        Student_1.Student.countDocuments({ classId: recordId, status: "active" }),
        Subject_1.Subject.countDocuments({ classId: recordId, isActive: true }),
    ]);
    const bySection = await Student_1.Student.aggregate([
        { $match: { classId: item._id, status: "active" } },
        { $group: { _id: "$section", count: { $sum: 1 } } },
    ]);
    return {
        class: { ...item.toObject(), sections },
        counts: {
            students,
            subjects,
            sections: sections.length,
            bySection: Object.fromEntries(bySection.map((row) => [row._id, row.count])),
        },
    };
}
