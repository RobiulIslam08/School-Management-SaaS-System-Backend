import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  archiveClass,
  classWorkspace,
  createClass,
  deleteClass,
  listClasses,
  removeSection,
  updateClass,
  upsertSection,
} from "./class.service";

export const classController = {
  async list(_req: Request, res: Response): Promise<void> {
    const items = await listClasses();
    ok(res, items, msg.loaded("Classes", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createClass(req.body);
    ok(res, created, msg.saved("Class"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const updated = await updateClass(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Class"));
  },
  async archive(req: Request, res: Response): Promise<void> {
    const updated = await archiveClass(routeParam(req.params.id));
    ok(res, updated, msg.archived("Class"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    await deleteClass(routeParam(req.params.id));
    ok(res, { deleted: true }, msg.archived("Class"));
  },
  async workspace(req: Request, res: Response): Promise<void> {
    const data = await classWorkspace(routeParam(req.params.id));
    ok(res, data, msg.loaded("Class"));
  },
  async saveSection(req: Request, res: Response): Promise<void> {
    const previousName = typeof req.body.previousName === "string" ? req.body.previousName : undefined;
    const updated = await upsertSection(routeParam(req.params.id), req.body, previousName);
    ok(res, updated, msg.saved("Section"));
  },
  async deleteSection(req: Request, res: Response): Promise<void> {
    const name = String(req.query.name ?? req.body.name ?? "");
    const updated = await removeSection(routeParam(req.params.id), name);
    ok(res, updated, msg.archived("Section"));
  },
};
