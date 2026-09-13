"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAttendance = listAttendance;
exports.saveAttendanceBulk = saveAttendanceBulk;
exports.roster = roster;
exports.recordedDates = recordedDates;
const Attendance_1 = require("../../../models/Attendance");
const Student_1 = require("../../../models/Student");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const attendance_utils_1 = require("./attendance.utils");
async function listAttendance(query) {
    return Attendance_1.Attendance.find((0, attendance_utils_1.attendanceFilter)(query)).populate("studentId", "name studentId");
}
async function saveAttendanceBulk(input) {
    if (!input.entries?.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noFields("Attendance"));
    }
    const ops = input.entries.map((entry) => ({
        updateOne: {
            filter: { studentId: entry.studentId, date: input.date },
            update: {
                $set: {
                    classId: input.classId,
                    section: input.section,
                    date: input.date,
                    status: entry.status,
                    remark: entry.remark ?? "",
                    markedBy: input.markedBy,
                },
            },
            upsert: true,
        },
    }));
    return Attendance_1.Attendance.bulkWrite(ops);
}
async function roster(classId, section) {
    return Student_1.Student.find({ classId, section, status: "active" }).select("name studentId rollNo photoUrl").sort({ rollNo: 1, name: 1 });
}
async function recordedDates(classId, section) {
    const filter = {};
    if (classId)
        filter.classId = classId;
    if (section)
        filter.section = section;
    return Attendance_1.Attendance.distinct("date", filter);
}
