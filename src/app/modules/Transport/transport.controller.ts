import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createRoute, deleteRoute, listRoutes, updateRoute } from "./transport.service";

export const transportController = {
  async list(_req: Request, res: Response): Promise<void> {
    const items = await listRoutes();
    ok(res, items, msg.loaded("Transport routes", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createRoute(req.body);
    ok(res, created, msg.saved("Transport route"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const updated = await updateRoute(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Transport route"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    await deleteRoute(routeParam(req.params.id));
    ok(res, { deleted: true }, msg.deleted("Transport route"));
  },
};
