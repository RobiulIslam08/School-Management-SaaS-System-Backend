import { Attendance } from "../../../models/Attendance";
import { ClassStructure } from "../../../models/ClassStructure";
import { ExamType } from "../../../models/ExamType";
import { FeeLedger } from "../../../models/Fee";
import { Notice } from "../../../models/Notice";
import { Result } from "../../../models/Result";
import { Student } from "../../../models/Student";
import { Teacher } from "../../../models/Teacher";
import type { DashboardActivity, DashboardStats } from "./report.interface";
import { isoDate, lastDays, monthRange, trendPct, uniqueTopPerformers } from "./report.dashboard.utils";

export async function areaReport() {
  return Student.aggregate([
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

export async function talentReport() {
  return Student.aggregate([
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

export async function dashboard(): Promise<DashboardStats> {
  const today = isoDate();
  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);
  const days = lastDays(30);
  const year = String(new Date().getFullYear());

  const [
    students,
    teachers,
    classes,
    dues,
    presentToday,
    markedToday,
    studentsThisMonth,
    studentsLastMonth,
    collectedMonth,
    collectedLastMonth,
    presentLastMonth,
    markedLastMonth,
    upcomingExams,
    pendingNotices,
    attendanceRows,
    feeMonths,
    classDist,
    recentStudents,
    recentLedgers,
    recentNotices,
    upcomingExamDocs,
    upcomingNoticeDocs,
    topResults,
  ] = await Promise.all([
    Student.countDocuments({ status: "active" }),
    Teacher.countDocuments({ isActive: true }),
    ClassStructure.countDocuments({ isActive: true }),
    FeeLedger.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: null,
          due: { $sum: { $subtract: ["$dueAmount", { $add: ["$paidAmount", "$discount"] }] } },
        },
      },
    ]),
    Attendance.countDocuments({ date: today, status: "present" }),
    Attendance.countDocuments({ date: today }),
    Student.countDocuments({ createdAt: { $gte: thisMonth.start, $lt: thisMonth.end } }),
    Student.countDocuments({ createdAt: { $gte: lastMonth.start, $lt: lastMonth.end } }),
    FeeLedger.aggregate([
      { $match: { deletedAt: null } },
      { $unwind: "$payments" },
      { $match: { "payments.date": { $gte: thisMonth.start, $lt: thisMonth.end } } },
      { $group: { _id: null, amount: { $sum: "$payments.amount" } } },
    ]),
    FeeLedger.aggregate([
      { $match: { deletedAt: null } },
      { $unwind: "$payments" },
      { $match: { "payments.date": { $gte: lastMonth.start, $lt: lastMonth.end } } },
      { $group: { _id: null, amount: { $sum: "$payments.amount" } } },
    ]),
    Attendance.countDocuments({
      date: { $gte: isoDate(lastMonth.start), $lt: isoDate(lastMonth.end) },
      status: "present",
    }),
    Attendance.countDocuments({ date: { $gte: isoDate(lastMonth.start), $lt: isoDate(lastMonth.end) } }),
    ExamType.countDocuments({
      $or: [{ startDate: { $gte: new Date() } }, { endDate: { $gte: new Date() } }],
    }),
    Notice.countDocuments({ isPublished: false }),
    Attendance.aggregate([
      { $match: { date: { $in: days } } },
      { $group: { _id: { date: "$date", status: "$status" }, count: { $sum: 1 } } },
    ]),
    FeeLedger.aggregate([
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
    Student.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$classId", count: { $sum: 1 } } },
      { $lookup: { from: "ClassStructures", localField: "_id", foreignField: "_id", as: "klass" } },
      { $unwind: { path: "$klass", preserveNullAndEmptyArrays: true } },
      { $project: { name: "$klass.name", count: 1 } },
      { $sort: { count: -1 } },
    ]),
    Student.find({ status: "active" }).sort({ createdAt: -1 }).limit(5).select("name studentId createdAt"),
    FeeLedger.find({ deletedAt: null, paidAmount: { $gt: 0 } })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("studentId", "name studentId"),
    Notice.find().sort({ createdAt: -1 }).limit(5).select("title isPublished createdAt"),
    ExamType.find({ $or: [{ startDate: { $gte: new Date() } }, { endDate: { $gte: new Date() } }] })
      .sort({ startDate: 1 })
      .limit(5),
    Notice.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).select("title createdAt"),
    Result.find({ deletedAt: null, academicYear: year })
      .sort({ gpa: -1 })
      .limit(40)
      .populate("studentId", "name studentId"),
  ]);

  const byDate = new Map<string, { present: number; total: number }>();
  for (const day of days) byDate.set(day, { present: 0, total: 0 });
  for (const row of attendanceRows as Array<{ _id: { date: string; status: string }; count: number }>) {
    const bucket = byDate.get(row._id.date);
    if (!bucket) continue;
    bucket.total += row.count;
    if (row._id.status === "present") bucket.present += row.count;
  }

  const activity: DashboardActivity[] = [
    ...recentStudents.map((item) => ({
      type: "admission" as const,
      title: item.name,
      at: ((item as { createdAt?: Date }).createdAt ?? new Date()).toISOString(),
      href: `/students/${String(item._id)}`,
    })),
    ...recentLedgers.map((item) => {
      const student = item.studentId as unknown as { name?: string; _id?: string };
      return {
        type: "payment" as const,
        title: student?.name ?? item.title,
        at: (item.updatedAt as Date).toISOString(),
        href: "/fees/collected",
      };
    }),
    ...recentNotices.map((item) => ({
      type: "notice" as const,
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
      students: trendPct(studentsThisMonth, studentsLastMonth),
      collected: trendPct(collectedMonth[0]?.amount ?? 0, collectedLastMonth[0]?.amount ?? 0),
      attendance: trendPct(attendancePct, lastAttPct),
    },
    attendanceSeries: days.map((date) => {
      const bucket = byDate.get(date) ?? { present: 0, total: 0 };
      return { date, pct: bucket.total ? Math.round((bucket.present / bucket.total) * 100) : 0 };
    }),
    feeSeries: (feeMonths as Array<{ _id: string; amount: number }>).map((row) => ({
      month: row._id,
      amount: row.amount,
    })),
    classDistribution: (classDist as Array<{ name?: string; count: number }>).map((row) => ({
      name: row.name || "—",
      count: row.count,
    })),
    activity,
    upcoming: [
      ...upcomingExamDocs.map((item) => ({
        title: item.name,
        at: (item.startDate ?? (item as { createdAt?: Date }).createdAt ?? new Date()).toISOString(),
        href: "/exams",
      })),
      ...upcomingNoticeDocs.map((item) => ({
        title: item.title,
        at: item.createdAt.toISOString(),
        href: "/notices",
      })),
    ].slice(0, 8),
    topPerformers: uniqueTopPerformers(
      topResults.map((row) => {
        const student = row.studentId as unknown as { _id?: string; name?: string; studentId?: string };
        if (!student?._id) return null;
        return { id: String(student._id), name: student.name ?? "", gpa: row.gpa, studentId: student.studentId ?? "" };
      }),
    ),
  };
}
