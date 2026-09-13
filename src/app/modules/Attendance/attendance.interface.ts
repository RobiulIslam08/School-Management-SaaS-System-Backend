export type AttendanceEntry = {
  studentId: string;
  status: "present" | "absent" | "late" | "leave";
  remark?: string;
};
