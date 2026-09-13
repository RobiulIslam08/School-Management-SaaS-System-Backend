"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areaReport = areaReport;
exports.talentReport = talentReport;
exports.dashboard = dashboard;
const Attendance_1 = require("../../../models/Attendance");
const ClassStructure_1 = require("../../../models/ClassStructure");
const ExamType_1 = require("../../../models/ExamType");
const Fee_1 = require("../../../models/Fee");
const Notice_1 = require("../../../models/Notice");
const Result_1 = require("../../../models/Result");
const Student_1 = require("../../../models/Student");
const Teacher_1 = require("../../../models/Teacher");
const report_dashboard_utils_1 = require("./report.dashboard.utils");
async function areaReport() {
    return Student_1.Student.aggregate([
        { $match: { status: "active" } },
        {
            $group: {
                _id: {
                    division: "$address.division",
                    district: "$address.district",
                    upazila: "$address.upazila",
                    area: "$address.area",
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);
}
async function talentReport() {
    return Student_1.Student.aggregate([
        { $unwind: "$talentTags" },
        {
            $group: {
                _id: "$talentTags",
                count: { $sum: 1 },
                students: { $push: { id: "$_id", name: "$name", studentId: "$studentId" } },
            },
        },
        { $sort: { count: -1 } },
    ]);
}
async function dashboard() {
    const today = (0, report_dashboard_utils_1.isoDate)();
    const thisMonth = (0, report_dashboard_utils_1.monthRange)(0);
    const lastMonth = (0, report_dashboard_utils_1.monthRange)(-1);
    const days = (0, report_dashboard_utils_1.lastDays)(30);
    const year = String(new Date().getFullYear());
    const [students, teachers, classes, dues, presentToday, markedToday, studentsThisMonth, studentsLastMonth, collectedMonth, collectedLastMonth, presentLastMonth, markedLastMonth, upcomingExams, pendingNotices, attendanceRows, feeMonths, classDist, recentStudents, recentLedgers, recentNotices, upcomingExamDocs, upcomingNoticeDocs, topResults,] = await Promise.all([
        Student_1.Student.countDocuments({ status: "active" }),
        Teacher_1.Teacher.countDocuments({ isActive: true }),
        ClassStructure_1.ClassStructure.countDocuments({ isActive: true }),
        Fee_1.FeeLedger.aggregate([
            { $match: { deletedAt: null } },
            {
                $group: {
                    _id: null,
                    due: { $sum: { $subtract: ["$dueAmount", { $add: ["$paidAmount", "$discount"] }] } },
                },
            },
        ]),
        Attendance_1.Attendance.countDocuments({ date: today, status: "present" }),
        Attendance_1.Attendance.countDocuments({ date: today }),
        Student_1.Student.countDocuments({ createdAt: { $gte: thisMonth.start, $lt: thisMonth.end } }),
        Student_1.Student.countDocuments({ createdAt: { $gte: lastMonth.start, $lt: lastMonth.end } }),
        Fee_1.FeeLedger.aggregate([
            { $match: { deletedAt: null } },
            { $unwind: "$payments" },
            { $match: { "payments.date": { $gte: thisMonth.start, $lt: thisMonth.end } } },
            { $group: { _id: null, amount: { $sum: "$payments.amount" } } },
        ]),
        Fee_1.FeeLedger.aggregate([
            { $match: { deletedAt: null } },
            { $unwind: "$payments" },
            { $match: { "payments.date": { $gte: lastMonth.start, $lt: lastMonth.end } } },
            { $group: { _id: null, amount: { $sum: "$payments.amount" } } },
        ]),
        Attendance_1.Attendance.countDocuments({
            date: { $gte: (0, report_dashboard_utils_1.isoDate)(lastMonth.start), $lt: (0, report_dashboard_utils_1.isoDate)(lastMonth.end) },
            status: "present",
        }),
        Attendance_1.Attendance.countDocuments({ date: { $gte: (0, report_dashboard_utils_1.isoDate)(lastMonth.start), $lt: (0, report_dashboard_utils_1.isoDate)(lastMonth.end) } }),
        ExamType_1.ExamType.countDocuments({
            $or: [{ startDate: { $gte: new Date() } }, { endDate: { $gte: new Date() } }],
        }),
        Notice_1.Notice.countDocuments({ isPublished: false }),
        Attendance_1.Attendance.aggregate([
            { $match: { date: { $in: days } } },
            { $group: { _id: { date: "$date", status: "$status" }, count: { $sum: 1 } } },
        ]),
        Fee_1.FeeLedger.aggregate([
            { $match: { deletedAt: null } },
            { $unwind: "$payments" },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$payments.date" } },
                    amount: { $sum: "$payments.amount" },
                },
            },
            { $sort: { _id: 1 } },
            { $limit: 12 },
        ]),
        Student_1.Student.aggregate([
            { $match: { status: "active" } },
            { $group: { _id: "$classId", count: { $sum: 1 } } },
            { $lookup: { from: "ClassStructures", localField: "_id", foreignField: "_id", as: "klass" } },
            { $unwind: { path: "$klass", preserveNullAndEmptyArrays: true } },
            { $project: { name: "$klass.name", count: 1 } },
            { $sort: { count: -1 } },
        ]),
        Student_1.Student.find({ status: "active" }).sort({ createdAt: -1 }).limit(5).select("name studentId createdAt"),
        Fee_1.FeeLedger.find({ deletedAt: null, paidAmount: { $gt: 0 } })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate("studentId", "name studentId"),
        Notice_1.Notice.find().sort({ createdAt: -1 }).limit(5).select("title isPublished createdAt"),
        ExamType_1.ExamType.find({ $or: [{ startDate: { $gte: new Date() } }, { endDate: { $gte: new Date() } }] })
            .sort({ startDate: 1 })
            .limit(5),
        Notice_1.Notice.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).select("title createdAt"),
        Result_1.Result.find({ deletedAt: null, academicYear: year }).sort({ gpa: -1 }).limit(5).populate("studentId", "name studentId"),
    ]);
    const byDate = new Map();
    for (const day of days)
        byDate.set(day, { present: 0, total: 0 });
    for (const row of attendanceRows) {
        const bucket = byDate.get(row._id.date);
        if (!bucket)
            continue;
        bucket.total += row.count;
        if (row._id.status === "present")
            bucket.present += row.count;
    }
    const activity = [
        ...recentStudents.map((item) => ({
            type: "admission",
            title: item.name,
            at: (item.createdAt ?? new Date()).toISOString(),
            href: `/students/${String(item._id)}`,
        })),
        ...recentLedgers.map((item) => {
            const student = item.studentId;
            return {
                type: "payment",
                title: student?.name ?? item.title,
                at: item.updatedAt.toISOString(),
                href: "/fees",
            };
        }),
        ...recentNotices.map((item) => ({
            type: "notice",
            title: item.title,
            at: item.createdAt.toISOString(),
            href: "/notices",
        })),
    ]
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, 8);
    const attendancePct = markedToday ? Math.round((presentToday / markedToday) * 100) : 0;
    const lastAttPct = markedLastMonth ? Math.round((presentLastMonth / markedLastMonth) * 100) : 0;
    return {
        students,
        teachers,
        classes,
        attendancePct,
        presentToday,
        markedToday,
        due: Math.max(dues[0]?.due ?? 0, 0),
        collectedMonth: collectedMonth[0]?.amount ?? 0,
        upcomingExams,
        pendingNotices,
        trends: {
            students: (0, report_dashboard_utils_1.trendPct)(studentsThisMonth, studentsLastMonth),
            collected: (0, report_dashboard_utils_1.trendPct)(collectedMonth[0]?.amount ?? 0, collectedLastMonth[0]?.amount ?? 0),
            attendance: (0, report_dashboard_utils_1.trendPct)(attendancePct, lastAttPct),
        },
        attendanceSeries: days.map((date) => {
            const bucket = byDate.get(date) ?? { present: 0, total: 0 };
            return { date, pct: bucket.total ? Math.round((bucket.present / bucket.total) * 100) : 0 };
        }),
        feeSeries: feeMonths.map((row) => ({
            month: row._id,
            amount: row.amount,
        })),
        classDistribution: classDist.map((row) => ({
            name: row.name || "—",
            count: row.count,
        })),
        activity,
        upcoming: [
            ...upcomingExamDocs.map((item) => ({
                title: item.name,
                at: (item.startDate ?? item.createdAt ?? new Date()).toISOString(),
                href: "/exams",
            })),
            ...upcomingNoticeDocs.map((item) => ({
                title: item.title,
                at: item.createdAt.toISOString(),
                href: "/notices",
            })),
        ].slice(0, 8),
        topPerformers: topResults
            .map((row) => {
            const student = row.studentId;
            if (!student?._id)
                return null;
            return { id: String(student._id), name: student.name ?? "", gpa: row.gpa, studentId: student.studentId ?? "" };
        })
            .filter((item) => Boolean(item)),
    };
}
