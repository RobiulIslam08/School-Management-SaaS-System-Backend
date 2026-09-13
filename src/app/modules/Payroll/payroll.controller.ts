import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createPayroll, listPayroll, markPaid } from "./payroll.service";

export const payrollController = {
  async list(_req: Request, res: Response): Promise<void> {
    const items = await listPayroll();
    ok(res, items, msg.loaded("Payroll", items.length));
  },
  async create(req: Request, res: Response): Promise<void> {
    const created = await createPayroll(req.body);
    ok(res, created, msg.saved("Payslip"), 201);
  },
  async pay(req: Request, res: Response): Promise<void> {
    const item = await markPaid(routeParam(req.params.id));
    ok(res, item, msg.updated("Payslip"));
  },
};
