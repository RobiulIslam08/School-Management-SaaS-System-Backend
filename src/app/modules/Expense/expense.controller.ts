import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createExpense, deleteExpense, expenseSummary, listExpenses, updateExpense } from "./expense.service";

export const expenseController = {
  async list(req: Request, res: Response): Promise<void> {
    const items = await listExpenses({
      year: typeof req.query.year === "string" ? req.query.year : undefined,
      month: typeof req.query.month === "string" ? req.query.month : undefined,
      category: typeof req.query.category === "string" ? req.query.category : undefined,
      q: typeof req.query.q === "string" ? req.query.q : undefined,
      from: typeof req.query.from === "string" ? req.query.from : undefined,
      to: typeof req.query.to === "string" ? req.query.to : undefined,
    });
    ok(res, items, msg.loaded("Expenses", items.length));
  },
  async summary(req: Request, res: Response): Promise<void> {
    ok(
      res,
      await expenseSummary({
        year: typeof req.query.year === "string" ? req.query.year : undefined,
        month: typeof req.query.month === "string" ? req.query.month : undefined,
      }),
      msg.loaded("Expense summary")
    );
  },
  async create(req: Request, res: Response): Promise<void> {
    ok(res, await createExpense(req.body, req.user), msg.saved("Expense"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    ok(res, await updateExpense(routeParam(req.params.id), req.body), msg.updated("Expense"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    ok(res, await deleteExpense(routeParam(req.params.id)), msg.deleted("Expense"));
  },
};
