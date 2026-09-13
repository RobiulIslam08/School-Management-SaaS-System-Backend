import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { deleteSlot, listRoutine, upsertSlot } from "./routine.service";

export const routineController = {
  async list(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const section = typeof req.query.section === "string" ? req.query.section : undefined;
    const items = await listRoutine(classId, section);
    ok(res, items, msg.loaded("Routine", items.length));
  },
  async save(req: Request, res: Response): Promise<void> {
    const saved = await upsertSlot(req.body);
    ok(res, saved, msg.saved("Routine"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    await deleteSlot(routeParam(req.params.id));
    ok(res, { deleted: true }, msg.archived("Routine"));
  },
};
