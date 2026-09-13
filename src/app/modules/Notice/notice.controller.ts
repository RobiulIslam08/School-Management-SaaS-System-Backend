import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createNotice, deleteNotice, listNotices, updateNotice } from "./notice.service";

export const noticeController = {
  async list(_req: Request, res: Response): Promise<void> {
    const items = await listNotices();
    ok(res, items, msg.loaded("Notices", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createNotice(req.body);
    ok(res, created, msg.saved("Notice"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const updated = await updateNotice(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Notice"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    await deleteNotice(routeParam(req.params.id));
    ok(res, { deleted: true }, msg.deleted("Notice"));
  },
};
