import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createHostel, deleteHostel, listHostels, updateHostel } from "./hostel.service";

export const hostelController = {
  async list(_req: Request, res: Response): Promise<void> {
    const items = await listHostels();
    ok(res, items, msg.loaded("Hostels", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createHostel(req.body);
    ok(res, created, msg.saved("Hostel"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const updated = await updateHostel(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Hostel"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    await deleteHostel(routeParam(req.params.id));
    ok(res, { deleted: true }, msg.deleted("Hostel"));
  },
};
