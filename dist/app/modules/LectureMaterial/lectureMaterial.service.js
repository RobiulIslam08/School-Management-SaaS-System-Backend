"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLectureMaterials = listLectureMaterials;
exports.createLectureMaterial = createLectureMaterial;
exports.updateLectureMaterial = updateLectureMaterial;
exports.deleteLectureMaterial = deleteLectureMaterial;
exports.listPublicLectureMaterials = listPublicLectureMaterials;
const LectureMaterial_1 = require("../../../models/LectureMaterial");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function listLectureMaterials(filter) {
    const query = {};
    if (filter.classId)
        query.classId = filter.classId;
    if (filter.subjectId)
        query.subjectId = filter.subjectId;
    if (filter.teacherId)
        query.teacherId = filter.teacherId;
    if (filter.academicYear)
        query.academicYear = filter.academicYear;
    return LectureMaterial_1.LectureMaterial.find(query)
        .populate("classId", "name")
        .populate("subjectId", "name code")
        .populate("teacherId", "name")
        .sort({ createdAt: -1 });
}
async function createLectureMaterial(body) {
    return LectureMaterial_1.LectureMaterial.create(body);
}
async function updateLectureMaterial(id, body) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Material", "ID is required."));
    const material = await LectureMaterial_1.LectureMaterial.findById(id);
    if (!material)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Lecture material"));
    Object.assign(material, body);
    await material.save();
    return material;
}
async function deleteLectureMaterial(id) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Material", "ID is required."));
    const material = await LectureMaterial_1.LectureMaterial.findByIdAndDelete(id);
    if (!material)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Lecture material"));
    return { deleted: true };
}
async function listPublicLectureMaterials(classId, subjectId) {
    const query = { isVisible: true };
    if (classId)
        query.classId = classId;
    if (subjectId)
        query.subjectId = subjectId;
    return LectureMaterial_1.LectureMaterial.find(query)
        .populate("classId", "name")
        .populate("subjectId", "name code")
        .populate("teacherId", "name")
        .sort({ createdAt: -1 });
}
