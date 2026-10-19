import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { routeParam } from "../../../utils/persist";
import {
  createLectureMaterial,
  deleteLectureMaterial,
  listLectureMaterials,
  listPublicLectureMaterials,
  updateLectureMaterial,
} from "./lectureMaterial.service";

export const lectureMaterialController = {
  async list(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
    const teacherId = typeof req.query.teacherId === "string" ? req.query.teacherId : undefined;
    const academicYear = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;

    const items = await listLectureMaterials({ classId, subjectId, teacherId, academicYear });
    ok(res, items, msg.loaded("Lecture materials", items.length));
  },

  async create(req: Request, res: Response): Promise<void> {
    const item = await createLectureMaterial(req.body);
    ok(res, item, msg.saved("Lecture material"), 201);
  },

  async update(req: Request, res: Response): Promise<void> {
    const item = await updateLectureMaterial(routeParam(req.params.id), req.body);
    ok(res, item, msg.updated("Lecture material"));
  },

  async remove(req: Request, res: Response): Promise<void> {
    const result = await deleteLectureMaterial(routeParam(req.params.id));
    ok(res, result, msg.deleted("Lecture material"));
  },

  async publicList(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
    const items = await listPublicLectureMaterials(classId, subjectId);
    ok(res, items, msg.loaded("Lecture materials", items.length));
  },
};
