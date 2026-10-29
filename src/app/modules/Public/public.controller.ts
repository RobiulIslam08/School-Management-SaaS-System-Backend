import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { routeParam } from "../../../utils/persist";
import { getPublicNotice } from "../Notice/notice.service";
import { guardianPortal, listPublicNotices, publicAdmission, publicBranding, publicClasses, teacherPortal } from "./public.service";

export const publicController = {
  async branding(_req: Request, res: Response): Promise<void> {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    ok(res, await publicBranding(), msg.loaded("School branding"));
  },
  async classes(_req: Request, res: Response): Promise<void> {
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    const items = await publicClasses();
    ok(res, items, msg.loaded("Admission classes", items.length));
  },
  async notices(_req: Request, res: Response): Promise<void> {
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    const items = await listPublicNotices();
    ok(res, items, msg.loaded("Notices", items.length));
  },
  async notice(req: Request, res: Response): Promise<void> {
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    ok(res, await getPublicNotice(routeParam(req.params.id)), msg.loaded("Notice"));
  },
  async apply(req: Request, res: Response): Promise<void> {
    const created = await publicAdmission(req.body);
    ok(res, { studentId: created.studentId }, msg.saved("Admission application"), 201);
  },
  async guardian(req: Request, res: Response): Promise<void> {
    const data = await guardianPortal(req.user!.id, req.user?.role, req.query.studentId as string | undefined);
    ok(res, data, msg.loaded("Guardian portal"));
  },
  async teacher(req: Request, res: Response): Promise<void> {
    const data = await teacherPortal(req.user!.id);
    ok(res, data, msg.loaded("Teacher portal"));
  },
};
