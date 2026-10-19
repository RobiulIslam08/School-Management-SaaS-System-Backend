"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStaffAttendance = listStaffAttendance;
exports.staffRoster = staffRoster;
exports.staffRecordedDates = staffRecordedDates;
exports.saveStaffAttendanceBulk = saveStaffAttendanceBulk;
const Accounts_1 = require("../../../models/Accounts");
const Teacher_1 = require("../../../models/Teacher");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
async function listStaffAttendance(query = {}) {
    const date = query.date;
    const from = query.from;
    const to = query.to;
    if (from || to) {
        if (!from || !to || !DATE_RE.test(from) || !DATE_RE.test(to) || from > to) {
            throw new ApiError_1.ApiError(400, "A valid date range (from and to, YYYY-MM-DD) is required");
        }
        return Accounts_1.StaffAttendance.find({ date: { $gte: from, $lte: to } })
            .populate("teacherId", "name staffId designation photoUrl")
            .sort({ date: 1 });
    }
    if (!date || !DATE_RE.test(date)) {
        throw new ApiError_1.ApiError(400, "A valid date (YYYY-MM-DD) is required");
    }
    return Accounts_1.StaffAttendance.find({ date })
        .populate("teacherId", "name staffId designation photoUrl")
        .sort({ date: -1 });
}
async function staffRoster() {
    return Teacher_1.Teacher.find({ isActive: true })
        .select("name staffId designation photoUrl")
        .sort({ name: 1 });
}
async function staffRecordedDates() {
    return Accounts_1.StaffAttendance.distinct("date");
}
async function saveStaffAttendanceBulk(input) {
    if (!DATE_RE.test(input.date)) {
        throw new ApiError_1.ApiError(400, "A valid date (YYYY-MM-DD) is required");
    }
    if (!input.entries?.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noFields("Staff attendance"));
    }
    const ids = [...new Set(input.entries.map((e) => e.teacherId))];
    const teachers = await Teacher_1.Teacher.find({ _id: { $in: ids }, isActive: true }).select("_id");
    if (teachers.length !== ids.length) {
        throw new ApiError_1.ApiError(400, "One or more staff members are missing or inactive");
    }
    const ops = input.entries.map((entry) => ({
        updateOne: {
            filter: { teacherId: entry.teacherId, date: input.date },
            update: {
                $set: {
                    teacherId: entry.teacherId,
                    date: input.date,
                    status: entry.status,
                    remark: entry.remark ?? "",
                    markedBy: input.markedBy,
                },
            },
            upsert: true,
        },
    }));
    await Accounts_1.StaffAttendance.bulkWrite(ops);
    return listStaffAttendance({ date: input.date });
}
