"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClasses = listClasses;
exports.createClass = createClass;
exports.updateClass = updateClass;
exports.listSubjects = listSubjects;
exports.createSubject = createSubject;
exports.updateSubject = updateSubject;
const ClassStructure_1 = require("../../../models/ClassStructure");
const Subject_1 = require("../../../models/Subject");
const persist_1 = require("../../../utils/persist");
async function listClasses() {
    return ClassStructure_1.ClassStructure.find().sort({ level: 1, name: 1 });
}
async function createClass(body) {
    return ClassStructure_1.ClassStructure.create(body);
}
async function updateClass(id, body) {
    return (0, persist_1.updateDocument)(ClassStructure_1.ClassStructure, id, body, "Class");
}
async function listSubjects(classId) {
    return Subject_1.Subject.find(classId ? { classId } : {}).populate("classId", "name code").sort({ name: 1 });
}
async function createSubject(body) {
    return Subject_1.Subject.create(body);
}
async function updateSubject(id, body) {
    return (0, persist_1.updateDocument)(Subject_1.Subject, id, body, "Subject");
}
