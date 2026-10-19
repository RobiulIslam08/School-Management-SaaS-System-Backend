"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTrainings = listTrainings;
exports.createTraining = createTraining;
exports.updateTraining = updateTraining;
exports.deleteTraining = deleteTraining;
exports.updateTrainingAttendance = updateTrainingAttendance;
const Training_1 = require("../../../models/Training");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function listTrainings(status) {
    const query = status ? { status } : {};
    return Training_1.Training.find(query).sort({ startDate: -1, createdAt: -1 });
}
async function createTraining(body) {
    return Training_1.Training.create(body);
}
async function updateTraining(id, body) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Training", "ID is required."));
    const item = await Training_1.Training.findById(id);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Training"));
    Object.assign(item, body);
    await item.save();
    return item;
}
async function deleteTraining(id) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Training", "ID is required."));
    const item = await Training_1.Training.findByIdAndDelete(id);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Training"));
    return { deleted: true };
}
async function updateTrainingAttendance(id, participants) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Training", "ID is required."));
    const item = await Training_1.Training.findById(id);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Training"));
    item.participants = participants;
    await item.save();
    return item;
}
