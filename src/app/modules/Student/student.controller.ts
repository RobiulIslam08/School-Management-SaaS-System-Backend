import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  createStudent,
  getStudent,
  listStudents,
  promoteAllStudents,
  promoteStudents,
  revertPromotion,
  studentSaveMessage,
  transferOutStudents,
  updateStudent,
} from "./student.service";

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
    const { student, sms } = await createStudent(req.body, req.user);
    ok(res, student, studentSaveMessage("saved", sms), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    const { student, sms } = await updateStudent(routeParam(req.params.id), req.body, req.user);
    ok(res, student, studentSaveMessage("updated", sms));
  },
  async promote(req: Request, res: Response): Promise<void> {
    const result = await promoteStudents(
      req.body.ids,
      req.body.targetClassId,
      req.body.targetSection,
      req.body.targetAcademicYear,
      req.user
    );
    ok(res, result, msg.updated("Student promotion"));
  },
  async revertPromotion(req: Request, res: Response): Promise<void> {
    const result = await revertPromotion(req.body.ids, req.user);
    ok(res, result, `${result.revertedCount} শিক্ষার্থীর প্রমোশন পূর্বাবস্থায় ফিরিয়ে নেওয়া হয়েছে।`);
  },
  async transferOut(req: Request, res: Response): Promise<void> {
    const result = await transferOutStudents(
      req.body.ids,
      Boolean(req.body.removeFromClass),
      req.body.reason,
      req.user
    );
    ok(res, result, `${result.modifiedCount} শিক্ষার্থীকে সফলভাবে ছাড়পত্র প্রদান/স্থানান্তর করা হয়েছে।`);
  },
  async promoteAll(req: Request, res: Response): Promise<void> {
    const result = await promoteAllStudents(req.user);
    const year = result.yearAdvanced ? ` Academic year is ${result.academicYear}.` : "";
    ok(
      res,
      result,
      `Promoted ${result.promoted} students. ${result.alumni} became alumni. ${result.skipped} stayed in place.${year}`
    );
  },
};
