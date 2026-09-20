import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { accountsSummary } from "./accounts.service";

export const accountsController = {
  async summary(req: Request, res: Response): Promise<void> {
    ok(
      res,
      await accountsSummary({
        year: typeof req.query.year === "string" ? req.query.year : undefined,
        month: typeof req.query.month === "string" ? req.query.month : undefined,
      }),
      msg.loaded("Accounts summary")
    );
  },
};
