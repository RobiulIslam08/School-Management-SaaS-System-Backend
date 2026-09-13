export type DashboardActivity = {
  type: "admission" | "payment" | "notice";
  title: string;
  at: string;
  href: string;
};

export type DashboardStats = {
  students: number;
  teachers: number;
  classes: number;
  attendancePct: number;
  presentToday: number;
  markedToday: number;
  due: number;
  collectedMonth: number;
  upcomingExams: number;
  pendingNotices: number;
  trends: {
    students: number;
    collected: number;
    attendance: number;
  };
  attendanceSeries: Array<{ date: string; pct: number }>;
  feeSeries: Array<{ month: string; amount: number }>;
  classDistribution: Array<{ name: string; count: number }>;
  activity: DashboardActivity[];
  upcoming: Array<{ title: string; at: string; href: string }>;
  topPerformers: Array<{ id: string; name: string; gpa: number; studentId: string }>;
};
