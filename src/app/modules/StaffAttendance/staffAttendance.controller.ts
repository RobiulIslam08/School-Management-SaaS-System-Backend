import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import {
  listStaffAttendance,
  saveStaffAttendanceBulk,
  staffRecordedDates,
  staffRoster,
} from "./staffAttendance.service";

export const staffAttendanceController = {
  async list(req: Request, res: Response): Promise<void> {
    const items = await listStaffAttendance(typeof req.query.date === "string" ? req.query.date : undefined);
    ok(res, items, msg.loaded("Staff attendance", items.length));
  },
  async roster(_req: Request, res: Response): Promise<void> {
    const items = await staffRoster();
    ok(res, items, msg.loaded("Staff roster", items.length));
  },
  async dates(_req: Request, res: Response): Promise<void> {
    ok(res, await staffRecordedDates(), msg.loaded("Attendance dates"));
  },
  async bulk(req: Request, res: Response): Promise<void> {
    const result = await saveStaffAttendanceBulk({
      date: req.body.date,
      entries: req.body.entries,
      markedBy: req.user?.id,
    });
    ok(res, result, msg.saved("Staff attendance"));
  },
};
