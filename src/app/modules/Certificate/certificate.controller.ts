import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  ensureCertificateTemplates,
  getIssued,
  issueCertificate,
  listIssued,
  listTemplates,
  updateTemplate,
} from "./certificate.service";

export const certificateController = {
  async listTemplates(_req: Request, res: Response): Promise<void> {
    const items = await listTemplates();
    ok(res, items, msg.loaded("Certificate templates", items.length));
  },
  async updateTemplate(req: Request, res: Response): Promise<void> {
    const updated = await updateTemplate(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Certificate template"));
  },
  async listIssued(req: Request, res: Response): Promise<void> {
    await ensureCertificateTemplates();
    const kind = typeof req.query.kind === "string" ? req.query.kind : undefined;
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const items = await listIssued(kind, classId);
    ok(res, items, msg.loaded("Certificates", items.length));
  },
  async getIssued(req: Request, res: Response): Promise<void> {
    const item = await getIssued(routeParam(req.params.id));
    ok(res, item, msg.loaded("Certificate"));
  },
  async issue(req: Request, res: Response): Promise<void> {
    const created = await issueCertificate(req.body, req.user);
    ok(res, created, msg.saved("Certificate"), 201);
  },
};
