import type { Request, Response } from "express";
import { ok } from "../../../utils/respond";
import { msg } from "../../../utils/messages";
import { getPackages, updatePackages } from "./owner.service";

export const ownerController = {
  async getPackages(_req: Request, res: Response): Promise<void> {
    const data = await getPackages();
    ok(res, data, msg.loaded("Feature packages"));
  },

  async updatePackages(req: Request, res: Response): Promise<void> {
    const result = await updatePackages(req.body.modules, req.user);
    ok(res, { modules: result.modules }, result.message);
  },
};
