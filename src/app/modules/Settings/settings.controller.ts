import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { getSettings, updateSettings } from "./settings.service";

export const settingsController = {
  async get(_req: Request, res: Response): Promise<void> {
    ok(res, await getSettings(), msg.loaded("School settings"));
  },
  async update(req: Request, res: Response): Promise<void> {
    const settings = await updateSettings(req.body, req.user);
    ok(res, settings, msg.updated("School settings"));
  },
};
