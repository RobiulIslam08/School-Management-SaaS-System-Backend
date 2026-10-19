import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { routeParam } from "../../../utils/persist";
import {
  deleteSeatPlan,
  generateSeatPlan,
  getSeatPlan,
  saveSeatPlan,
} from "./seatPlan.service";

export const seatPlanController = {
  async get(req: Request, res: Response): Promise<void> {
    const examId = routeParam(req.params.examId);
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const section = typeof req.query.section === "string" ? req.query.section : undefined;
    const plan = await getSeatPlan(examId, classId, section);
    ok(res, plan, msg.loaded("Seat plan", plan ? 1 : 0));
  },

  async generate(req: Request, res: Response): Promise<void> {
    const plan = await generateSeatPlan(req.body);
    ok(res, plan, msg.saved("Seat plan"), 201);
  },

  async update(req: Request, res: Response): Promise<void> {
    const plan = await saveSeatPlan(routeParam(req.params.id), req.body);
    ok(res, plan, msg.updated("Seat plan"));
  },

  async remove(req: Request, res: Response): Promise<void> {
    const result = await deleteSeatPlan(routeParam(req.params.id));
    ok(res, result, msg.deleted("Seat plan"));
  },
};
