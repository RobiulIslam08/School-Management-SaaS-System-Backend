import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createTeacher, listTeachers, updateTeacher } from "./teacher.service";

export const teacherController = {
  async list(req: Request, res: Response): Promise<void> {
    const q = typeof req.query.q === "string" ? req.query.q : "";
    const items = await listTeachers(q);
    ok(res, items, msg.loaded("Teachers", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createTeacher(req.body);
    ok(res, created, msg.saved("Teacher"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const updated = await updateTeacher(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Teacher"));
  },
};
