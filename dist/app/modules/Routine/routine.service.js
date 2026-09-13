"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoutine = listRoutine;
exports.upsertSlot = upsertSlot;
exports.deleteSlot = deleteSlot;
const Routine_1 = require("../../../models/Routine");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
async function listRoutine(classId, section) {
    const filter = {};
    if (classId)
        filter.classId = classId;
    if (section)
        filter.section = section;
    return Routine_1.Routine.find(filter)
        .populate("subjectId", "name code")
        .populate("teacherId", "name staffId")
        .sort({ day: 1, period: 1 });
}
async function upsertSlot(body) {
    return Routine_1.Routine.findOneAndUpdate({ classId: body.classId, section: body.section, day: body.day, period: body.period }, {
        $set: {
            subjectId: body.subjectId || undefined,
            teacherId: body.teacherId || undefined,
        },
    }, { upsert: true, new: true });
}
async function deleteSlot(id) {
    const recordId = (0, persist_1.requireId)(id, "Routine");
    const item = await Routine_1.Routine.findByIdAndDelete(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Routine"));
    return { deleted: true };
}
