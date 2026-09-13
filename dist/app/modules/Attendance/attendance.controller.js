"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const attendance_service_1 = require("./attendance.service");
exports.attendanceController = {
    async list(req, res) {
        const items = await (0, attendance_service_1.listAttendance)(req.query);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Attendance", items.length));
    },
    async bulk(req, res) {
        const result = await (0, attendance_service_1.saveAttendanceBulk)({ ...req.body, markedBy: req.user?.id });
        (0, respond_1.ok)(res, { upserted: result.upsertedCount, modified: result.modifiedCount }, messages_1.msg.saved("Attendance"));
    },
    async roster(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const section = typeof req.query.section === "string" ? req.query.section : undefined;
        const students = await (0, attendance_service_1.roster)(classId, section);
        (0, respond_1.ok)(res, students, messages_1.msg.loaded("Attendance roster", students.length));
    },
    async dates(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const section = typeof req.query.section === "string" ? req.query.section : undefined;
        const items = await (0, attendance_service_1.recordedDates)(classId, section);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Attendance dates", items.length));
    },
};
