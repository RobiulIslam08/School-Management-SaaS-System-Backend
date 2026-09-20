import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createNotice, deleteNotice, getNotice, listNotices, updateNotice } from "./notice.service";

export const noticeController = {
  async list(req: Request, res: Response): Promise<void> {
    const items = await listNotices({
      status: typeof req.query.status === "string" ? req.query.status : undefined,
      audience: typeof req.query.audience === "string" ? req.query.audience : undefined,
      q: typeof req.query.q === "string" ? req.query.q : undefined,
      category: typeof req.query.category === "string" ? req.query.category : undefined,
    });
    ok(res, items, msg.loaded("Notices", items.length));
  },
  async get(req: Request, res: Response): Promise<void> {
    ok(res, await getNotice(routeParam(req.params.id)), msg.loaded("Notice"));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createNotice(req.body, req.user);
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
