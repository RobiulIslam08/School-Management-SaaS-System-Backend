import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { attendanceSaveMessage, listAttendance, recordedDates, roster, saveAttendanceBulk } from "./attendance.service";

export const attendanceController = {
  async list(req: Request, res: Response): Promise<void> {
    const items = await listAttendance(req.query as Record<string, unknown>);
    ok(res, items, msg.loaded("Attendance", items.length));
  },
  async bulk(req: Request, res: Response): Promise<void> {
    const result = await saveAttendanceBulk({ ...req.body, markedBy: req.user?.id });
    ok(res, result, attendanceSaveMessage(result.sms));
  },
  async roster(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const section = typeof req.query.section === "string" ? req.query.section : undefined;
    const students = await roster(classId, section);
    ok(res, students, msg.loaded("Attendance roster", students.length));
  },
  async dates(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const section = typeof req.query.section === "string" ? req.query.section : undefined;
    const items = await recordedDates(classId, section);
    ok(res, items, msg.loaded("Attendance dates", items.length));
  },
};
