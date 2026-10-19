import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { routeParam } from "../../../utils/persist";
import {
  bulkSaveAdmissionResults,
  createAdmissionExam,
  deleteAdmissionExam,
  listAdmissionExams,
  listAdmissionResults,
  publishAdmissionExam,
  searchPublicAdmissionResult,
  updateAdmissionExam,
  upsertAdmissionResult,
} from "./admissionExam.service";

export const admissionExamController = {
  async listExams(req: Request, res: Response): Promise<void> {
    const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
    const items = await listAdmissionExams(year);
    ok(res, items, msg.loaded("Admission exams", items.length));
  },

  async createExam(req: Request, res: Response): Promise<void> {
    const created = await createAdmissionExam(req.body);
    ok(res, created, msg.saved("Admission exam"), 201);
  },

  async updateExam(req: Request, res: Response): Promise<void> {
    const updated = await updateAdmissionExam(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Admission exam"));
  },

  async deleteExam(req: Request, res: Response): Promise<void> {
    const result = await deleteAdmissionExam(routeParam(req.params.id));
    ok(res, result, msg.deleted("Admission exam"));
  },

  async publishExam(req: Request, res: Response): Promise<void> {
    const isPublished = Boolean(req.body.isPublished);
    const updated = await publishAdmissionExam(routeParam(req.params.id), isPublished);
    ok(res, updated, msg.updated("Admission exam status"));
  },

  async listResults(req: Request, res: Response): Promise<void> {
    const examId = routeParam(req.params.examId);
    const results = await listAdmissionResults(examId);
    ok(res, results, msg.loaded("Admission results", results.length));
  },

  async upsertResult(req: Request, res: Response): Promise<void> {
    const examId = routeParam(req.params.examId);
    const result = await upsertAdmissionResult(examId, req.body);
    ok(res, result, msg.saved("Admission result"));
  },

  async bulkSaveResults(req: Request, res: Response): Promise<void> {
    const examId = routeParam(req.params.examId);
    const items = Array.isArray(req.body.results) ? req.body.results : [];
    const saved = await bulkSaveAdmissionResults(examId, items);
    ok(res, saved, msg.saved(`Admission results (${saved.length})`));
  },

  async searchPublic(req: Request, res: Response): Promise<void> {
    const examId = typeof req.query.examId === "string" ? req.query.examId : undefined;
    const roll = typeof req.query.roll === "string" ? req.query.roll : undefined;
    const phone = typeof req.query.phone === "string" ? req.query.phone : undefined;
    const items = await searchPublicAdmissionResult({ examId, roll, phone });
    ok(res, items, msg.loaded("Admission results", items.length));
  },
};
