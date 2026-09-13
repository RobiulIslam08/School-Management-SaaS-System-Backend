"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotices = listNotices;
exports.createNotice = createNotice;
exports.updateNotice = updateNotice;
exports.deleteNotice = deleteNotice;
const Notice_1 = require("../../../models/Notice");
const persist_1 = require("../../../utils/persist");
async function listNotices() {
    return Notice_1.Notice.find().populate("classId", "name").sort({ createdAt: -1 });
}
async function createNotice(body) {
    return Notice_1.Notice.create({
        title: body.title,
        body: body.body,
        audience: body.audience ?? "all",
        classId: body.classId || undefined,
        isPublished: body.isPublished !== false,
    });
}
async function updateNotice(id, body) {
    return (0, persist_1.updateDocument)(Notice_1.Notice, id, body, "Notice");
}
async function deleteNotice(id) {
    return (0, persist_1.deleteDocument)(Notice_1.Notice, id, "Notice");
}
