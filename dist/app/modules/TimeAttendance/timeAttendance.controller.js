"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeAttendanceController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const persist_1 = require("../../../utils/persist");
const timeAttendance_service_1 = require("./timeAttendance.service");
exports.timeAttendanceController = {
    async pushPunches(req, res) {
        const { deviceId, punches } = req.body;
        const result = await (0, timeAttendance_service_1.pushPunches)(deviceId, punches);
        (0, respond_1.ok)(res, result, messages_1.msg.saved(`Time attendance punches (${result.count})`), 201);
    },
    async listLogs(req, res) {
        const date = typeof req.query.date === "string" ? req.query.date : undefined;
        const deviceId = typeof req.query.deviceId === "string" ? req.query.deviceId : undefined;
        const staffId = typeof req.query.staffId === "string" ? req.query.staffId : undefined;
        const items = await (0, timeAttendance_service_1.listTimeLogs)({ date, deviceId, staffId });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Attendance logs", items.length));
    },
    async listMappings(req, res) {
        const deviceId = typeof req.query.deviceId === "string" ? req.query.deviceId : undefined;
        const items = await (0, timeAttendance_service_1.listDeviceMappings)(deviceId);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Device mappings", items.length));
    },
    async upsertMapping(req, res) {
        const item = await (0, timeAttendance_service_1.upsertDeviceMapping)(req.body);
        (0, respond_1.ok)(res, item, messages_1.msg.saved("Device mapping"));
    },
    async deleteMapping(req, res) {
        const result = await (0, timeAttendance_service_1.deleteDeviceMapping)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Device mapping"));
    },
};
