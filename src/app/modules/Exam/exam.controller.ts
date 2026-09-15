import type { Request, Response } from "express";
import ExcelJS from "exceljs";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  createExam,
  createGradingRule,
  deleteExam,
  publishExam,
  exportResults,
  finalGrade,
  listExams,
  listGradingRules,
  listResults,
  recomputeMerit,
  updateExam,
  upsertResult,
} from "./exam.service";

export const examController = {
  async listExams(req: Request, res: Response): Promise<void> {
    const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
    const items = await listExams(year);
    ok(res, items, msg.loaded("Exams", items.length));
  },
  async createExam(req: Request, res: Response): Promise<void> {
    const created = await createExam(req.body);
    ok(res, created, msg.saved("Exam type"), 201);
  },
  async updateExam(req: Request, res: Response): Promise<void> {
    const updated = await updateExam(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Exam"));
  },
  async deleteExam(req: Request, res: Response): Promise<void> {
    const data = await deleteExam(routeParam(req.params.id));
    ok(res, data, msg.deleted("Exam"));
  },
  async publish(req: Request, res: Response): Promise<void> {
    const updated = await publishExam(routeParam(req.params.id), Boolean(req.body.isPublished));
    ok(res, updated, msg.updated("Exam"));
  },
  async listRules(req: Request, res: Response): Promise<void> {
    const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
    const items = await listGradingRules(year);
    ok(res, items, msg.loaded("Grading formulas", items.length));
  },
  async createRule(req: Request, res: Response): Promise<void> {
    const created = await createGradingRule(req.body);
    ok(res, created, msg.saved("Grading formula"), 201);
  },
  async listResults(req: Request, res: Response): Promise<void> {
    const items = await listResults({
      examTypeId: req.query.examTypeId,
      studentId: req.query.studentId,
      classId: req.query.classId,
      section: req.query.section,
    });
    ok(res, items, msg.loaded("Results", items.length));
  },
  async saveResult(req: Request, res: Response): Promise<void> {
    const saved = await upsertResult(req.body, req.user);
    ok(res, saved.record, saved.created ? msg.saved("Marks") : msg.updated("Marks"));
  },
  async merit(req: Request, res: Response): Promise<void> {
    const ranked = await recomputeMerit(routeParam(req.params.examTypeId));
    ok(res, ranked, msg.updated("Merit list"));
  },
  async final(req: Request, res: Response): Promise<void> {
    const year = String(req.query.academicYear ?? new Date().getFullYear());
    ok(res, await finalGrade(routeParam(req.params.studentId) ?? "", year), msg.loaded("Final grade"));
  },
  async exportXlsx(req: Request, res: Response): Promise<void> {
    const rows = await exportResults(routeParam(req.params.examTypeId));
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Results");
    sheet.addRow(["Merit", "Student ID", "Name", "GPA", "Letter", "Total"]);
    rows.forEach((row) => {
      const student = row.studentId as unknown as { studentId: string; name: string };
      sheet.addRow([row.meritPosition, student?.studentId, student?.name, row.gpa, row.letter, row.totalObtained]);
    });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=results.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  },
};
