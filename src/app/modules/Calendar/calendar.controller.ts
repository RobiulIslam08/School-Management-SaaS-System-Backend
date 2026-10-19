import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { routeParam } from "../../../utils/persist";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
  listPublicCalendarEvents,
  updateCalendarEvent,
} from "./calendar.service";

export const calendarController = {
  async list(req: Request, res: Response): Promise<void> {
    const { academicYear, month, year, type } = req.query as Record<string, string | undefined>;
    const items = await listCalendarEvents({ academicYear, month, year, type });
    ok(res, items, msg.loaded("Calendar events", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const event = await createCalendarEvent({ ...req.body, createdBy: req.user?.id });
    ok(res, event, msg.saved("Calendar event"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const event = await updateCalendarEvent(routeParam(req.params.id), req.body);
    ok(res, event, msg.updated("Calendar event"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    const data = await deleteCalendarEvent(routeParam(req.params.id));
    ok(res, data, msg.deleted("Calendar event"));
  },
  async publicList(req: Request, res: Response): Promise<void> {
    const year = typeof req.query.year === "string" ? req.query.year : undefined;
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    const items = await listPublicCalendarEvents(year);
    ok(res, items, msg.loaded("Calendar events", items.length));
  },
};
