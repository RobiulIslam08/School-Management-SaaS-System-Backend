"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTeachers = listTeachers;
exports.createTeacher = createTeacher;
exports.updateTeacher = updateTeacher;
const Teacher_1 = require("../../../models/Teacher");
const persist_1 = require("../../../utils/persist");
const teacher_utils_1 = require("./teacher.utils");
async function listTeachers(q) {
    const filter = q
        ? { $or: [{ name: new RegExp(q, "i") }, { staffId: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }] }
        : {};
    return Teacher_1.Teacher.find(filter).populate("subjects", "name code").sort({ name: 1 });
}
async function createTeacher(body) {
    const count = await Teacher_1.Teacher.countDocuments();
    const staffId = String(body.staffId || (await (0, teacher_utils_1.nextStaffId)(count)));
    return Teacher_1.Teacher.create({ ...body, staffId });
}
async function updateTeacher(id, body) {
    return (0, persist_1.updateDocument)(Teacher_1.Teacher, id, body, "Teacher");
}
