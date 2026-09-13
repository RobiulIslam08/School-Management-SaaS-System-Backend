import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createStudent, getStudent, listStudents, promoteStudents, updateStudent } from "./student.service";

export const studentController = {
  async list(req: Request, res: Response): Promise<void> {
    const items = await listStudents(req.query as Record<string, unknown>);
    ok(res, items, msg.loaded("Students", items.length));
  },
  async get(req: Request, res: Response): Promise<void> {
    const item = await getStudent(routeParam(req.params.id));
    ok(res, item, msg.loaded("Student"));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createStudent(req.body, req.user);
    ok(res, created, msg.saved("Student"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const updated = await updateStudent(routeParam(req.params.id), req.body, req.user);
    ok(res, updated, msg.updated("Student"));
  },
  async promote(req: Request, res: Response): Promise<void> {
    const result = await promoteStudents(req.body.ids, req.body.targetClassId, req.body.targetSection, req.user);
    ok(res, result, msg.updated("Student promotion"));
  },
};
