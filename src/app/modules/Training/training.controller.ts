import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { routeParam } from "../../../utils/persist";
import {
  createTraining,
  deleteTraining,
  listTrainings,
  updateTraining,
  updateTrainingAttendance,
} from "./training.service";

export const trainingController = {
  async list(req: Request, res: Response): Promise<void> {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const items = await listTrainings(status);
    ok(res, items, msg.loaded("Trainings", items.length));
  },

  async create(req: Request, res: Response): Promise<void> {
    const item = await createTraining(req.body);
    ok(res, item, msg.saved("Training session"), 201);
  },

  async update(req: Request, res: Response): Promise<void> {
    const item = await updateTraining(routeParam(req.params.id), req.body);
    ok(res, item, msg.updated("Training session"));
  },

  async remove(req: Request, res: Response): Promise<void> {
    const result = await deleteTraining(routeParam(req.params.id));
    ok(res, result, msg.deleted("Training session"));
  },

  async updateAttendance(req: Request, res: Response): Promise<void> {
    const participants = Array.isArray(req.body.participants) ? req.body.participants : [];
    const item = await updateTrainingAttendance(routeParam(req.params.id), participants);
    ok(res, item, msg.updated("Training attendance"));
  },
};
