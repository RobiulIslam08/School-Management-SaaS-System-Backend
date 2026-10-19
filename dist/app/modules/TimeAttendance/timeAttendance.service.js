"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushPunches = pushPunches;
exports.listTimeLogs = listTimeLogs;
exports.listDeviceMappings = listDeviceMappings;
exports.upsertDeviceMapping = upsertDeviceMapping;
exports.deleteDeviceMapping = deleteDeviceMapping;
const TimeAttendance_1 = require("../../../models/TimeAttendance");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function pushPunches(deviceId, punches) {
    if (!deviceId)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Time Attendance", "Device ID is required."));
    if (!Array.isArray(punches) || punches.length === 0) {
        return { count: 0 };
    }
    // Pre-load device user mappings
    const mappings = await TimeAttendance_1.DeviceUserMap.find({ deviceId });
    const mapByUser = new Map(mappings.map((m) => [m.deviceUserId, m]));
    const docs = punches.map((p) => {
        const pDate = new Date(p.punchTime);
        const dateStr = !Number.isNaN(pDate.getTime()) ? pDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        const map = mapByUser.get(String(p.deviceUserId));
        return {
            deviceId,
            deviceUserId: String(p.deviceUserId),
            punchTime: !Number.isNaN(pDate.getTime()) ? pDate : new Date(),
            punchType: p.punchType ?? "unknown",
            rawData: p.rawData,
            staffId: map?.staffId,
            staffName: map?.staffName ?? "",
            date: dateStr,
        };
    });
    const inserted = await TimeAttendance_1.TimeAttendanceLog.insertMany(docs);
    return { count: inserted.length };
}
async function listTimeLogs(filter) {
    const query = {};
    if (filter.date)
        query.date = filter.date;
    if (filter.deviceId)
        query.deviceId = filter.deviceId;
    if (filter.staffId)
        query.staffId = filter.staffId;
    return TimeAttendance_1.TimeAttendanceLog.find(query).sort({ punchTime: -1 }).limit(200);
}
async function listDeviceMappings(deviceId) {
    const query = deviceId ? { deviceId } : {};
    return TimeAttendance_1.DeviceUserMap.find(query).sort({ deviceId: 1, deviceUserId: 1 });
}
async function upsertDeviceMapping(body) {
    if (!body.deviceId || !body.deviceUserId || !body.staffId) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Device Mapping", "deviceId, deviceUserId and staffId are required."));
    }
    const updated = await TimeAttendance_1.DeviceUserMap.findOneAndUpdate({ deviceId: body.deviceId.trim(), deviceUserId: body.deviceUserId.trim() }, { ...body, deviceId: body.deviceId.trim(), deviceUserId: body.deviceUserId.trim() }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return updated;
}
async function deleteDeviceMapping(id) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Device Mapping", "ID is required."));
    const item = await TimeAttendance_1.DeviceUserMap.findByIdAndDelete(id);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Device Mapping"));
    return { deleted: true };
}
