"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAttendance = listAttendance;
exports.saveAttendanceBulk = saveAttendanceBulk;
exports.attendanceSaveMessage = attendanceSaveMessage;
exports.roster = roster;
exports.recordedDates = recordedDates;
const Attendance_1 = require("../../../models/Attendance");
const ClassStructure_1 = require("../../../models/ClassStructure");
const Student_1 = require("../../../models/Student");
const dispatch_1 = require("../../../lib/sms/dispatch");
const phone_1 = require("../../../lib/sms/phone");
const templates_1 = require("../../../lib/sms/templates");
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
    const absentNow = input.entries.filter((entry) => entry.status === "absent").map((entry) => entry.studentId);
    const already = absentNow.length
        ? await Attendance_1.Attendance.find({ date: input.date, studentId: { $in: absentNow }, status: "absent" }).select("studentId")
        : [];
    const freshAbsent = new Set((0, attendance_utils_1.newlyAbsentStudentIds)(input.entries, already.map((row) => String(row.studentId))));
    const result = await Attendance_1.Attendance.bulkWrite(ops);
    const sms = await sendAbsentSms({
        ...input,
        entries: input.entries.filter((entry) => freshAbsent.has(entry.studentId)),
    });
    return {
        upserted: result.upsertedCount ?? 0,
        modified: result.modifiedCount ?? 0,
        sms,
    };
}
async function sendAbsentSms(input) {
    const absentIds = input.entries.filter((e) => e.status === "absent").map((e) => e.studentId);
    if (!absentIds.length)
        return (0, dispatch_1.emptySmsSummary)();
    if (!(await (0, dispatch_1.isSmsTriggerEnabled)("attendance")))
        return (0, dispatch_1.emptySmsSummary)();
    const [students, klass, schoolName] = await Promise.all([
        Student_1.Student.find({ _id: { $in: absentIds } }).select("name nameBn guardian"),
        ClassStructure_1.ClassStructure.findById(input.classId).select("name").lean(),
        (0, dispatch_1.getSmsSchoolName)(),
    ]);
    const items = students
        .map((student) => {
        const to = (0, phone_1.fatherNotifyPhone)(student.guardian);
        if (!to)
            return null;
        return {
            to,
            body: (0, templates_1.attendanceAbsentSms)({
                schoolName,
                studentName: student.nameBn || student.name,
                date: input.date,
                className: klass?.name,
            }),
            template: "attendance_absent",
            audience: "guardian",
        };
    })
        .filter((item) => Boolean(item));
    const skipped = absentIds.length - items.length;
    const summary = await (0, dispatch_1.dispatchSms)(items);
    summary.skipped += skipped;
    return summary;
}
function attendanceSaveMessage(sms) {
    return `${messages_1.msg.saved("Attendance")}${(0, dispatch_1.smsNote)(sms)}`.trim();
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
