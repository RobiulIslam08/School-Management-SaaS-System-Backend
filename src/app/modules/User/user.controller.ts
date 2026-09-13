import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createStaff, listStaff, updateStaff } from "./user.service";

export const userController = {
  async list(_req: Request, res: Response): Promise<void> {
    const users = await listStaff();
    ok(res, users, msg.loaded("Staff accounts", users.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const user = await createStaff(req.body);
    ok(res, user, msg.saved("Staff account"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const user = await updateStaff(routeParam(req.params.id) ?? "", req.body, req.user?.id);
    ok(res, user, msg.updated("Staff account"));
  },
};
