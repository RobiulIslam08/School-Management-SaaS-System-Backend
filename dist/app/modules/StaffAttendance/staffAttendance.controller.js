"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffAttendanceController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const staffAttendance_service_1 = require("./staffAttendance.service");
exports.staffAttendanceController = {
    async list(req, res) {
        const items = await (0, staffAttendance_service_1.listStaffAttendance)({
            date: typeof req.query.date === "string" ? req.query.date : undefined,
            from: typeof req.query.from === "string" ? req.query.from : undefined,
            to: typeof req.query.to === "string" ? req.query.to : undefined,
        });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Staff attendance", items.length));
    },
    async roster(_req, res) {
        const items = await (0, staffAttendance_service_1.staffRoster)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Staff roster", items.length));
    },
    async dates(_req, res) {
        (0, respond_1.ok)(res, await (0, staffAttendance_service_1.staffRecordedDates)(), messages_1.msg.loaded("Attendance dates"));
    },
    async bulk(req, res) {
        const result = await (0, staffAttendance_service_1.saveStaffAttendanceBulk)({
            date: req.body.date,
            entries: req.body.entries,
            markedBy: req.user?.id,
        });
        (0, respond_1.ok)(res, result, messages_1.msg.saved("Staff attendance"));
    },
};
