import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { areaReport, dashboard, talentReport } from "./report.service";

export const reportController = {
  async areas(_req: Request, res: Response): Promise<void> {
    const rows = await areaReport();
    ok(res, rows, msg.loaded("Area report", rows.length));
  },
  async talent(_req: Request, res: Response): Promise<void> {
    const rows = await talentReport();
    ok(res, rows, msg.loaded("Talent report", rows.length));
  },
  async dashboard(_req: Request, res: Response): Promise<void> {
    ok(res, await dashboard(), msg.loaded("Dashboard"));
  },
};
