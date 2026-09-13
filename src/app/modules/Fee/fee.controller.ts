import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  addPayment,
  archiveLedger,
  createLedger,
  createStructure,
  feeSummary,
  listLedgers,
  listStructures,
} from "./fee.service";

export const feeController = {
  async listStructures(req: Request, res: Response): Promise<void> {
    const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
    const items = await listStructures(year);
    ok(res, items, msg.loaded("Fee structures", items.length));
  },
  async createStructure(req: Request, res: Response): Promise<void> {
    const created = await createStructure(req.body);
    ok(res, created, msg.saved("Fee structure"), 201);
  },
  async listLedgers(req: Request, res: Response): Promise<void> {
    const items = await listLedgers(req.query as Record<string, unknown>);
    ok(res, items, msg.loaded("Fee ledgers", items.length));
  },
  async createLedger(req: Request, res: Response): Promise<void> {
    const created = await createLedger(req.body);
    ok(res, created, msg.saved("Fee due"), 201);
  },
  async pay(req: Request, res: Response): Promise<void> {
    const ledger = await addPayment(routeParam(req.params.id), req.body, req.user);
    ok(res, ledger, msg.saved("Payment"));
  },
  async summary(_req: Request, res: Response): Promise<void> {
    ok(res, await feeSummary(), msg.loaded("Fee summary"));
  },
  async archive(req: Request, res: Response): Promise<void> {
    const data = await archiveLedger(routeParam(req.params.id));
    ok(res, data, msg.archived("Fee ledger"));
  },
};
