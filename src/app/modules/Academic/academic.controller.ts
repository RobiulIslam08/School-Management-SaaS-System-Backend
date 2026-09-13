import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  createClass,
  createSubject,
  listClasses,
  listSubjects,
  updateClass,
  updateSubject,
} from "./academic.service";

export const academicController = {
  async listClasses(_req: Request, res: Response): Promise<void> {
    const items = await listClasses();
    ok(res, items, msg.loaded("Classes", items.length));
  },
  async createClass(req: Request, res: Response): Promise<void> {
    const created = await createClass(req.body);
    ok(res, created, msg.saved("Class"), 201);
  },
  async updateClass(req: Request, res: Response): Promise<void> {
    const updated = await updateClass(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Class"));
  },
  async listSubjects(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const items = await listSubjects(classId);
    ok(res, items, msg.loaded("Subjects", items.length));
  },
  async createSubject(req: Request, res: Response): Promise<void> {
    const created = await createSubject(req.body);
    ok(res, created, msg.saved("Subject"), 201);
  },
  async updateSubject(req: Request, res: Response): Promise<void> {
    const updated = await updateSubject(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Subject"));
  },
};
