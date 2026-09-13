import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  assignTeacher,
  createSubject,
  deleteSubject,
  listSubjects,
  reorderSubjects,
  updateSubject,
} from "./subject.service";

export const subjectController = {
  async list(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const items = await listSubjects(classId);
    ok(res, items, msg.loaded("Subjects", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createSubject(req.body);
    ok(res, created, msg.saved("Subject"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const updated = await updateSubject(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Subject"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    await deleteSubject(routeParam(req.params.id));
    ok(res, { deleted: true }, msg.archived("Subject"));
  },
  async reorder(req: Request, res: Response): Promise<void> {
    const items = await reorderSubjects(req.body.classId, req.body.orderedIds);
    ok(res, items, msg.updated("Subject order"));
  },
  async teacher(req: Request, res: Response): Promise<void> {
    const updated = await assignTeacher(routeParam(req.params.id), req.body.teacherId);
    ok(res, updated, msg.updated("Subject teacher"));
  },
};
