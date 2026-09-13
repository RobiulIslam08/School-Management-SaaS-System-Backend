import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { listSms, queueSms } from "./sms.service";

export const smsController = {
  async list(_req: Request, res: Response): Promise<void> {
    const items = await listSms();
    ok(res, items, msg.loaded("SMS logs", items.length));
  },
  async send(req: Request, res: Response): Promise<void> {
    const result = await queueSms(req.body);
    ok(res, result, `${msg.saved("SMS queue")} Gateway is not connected yet.`);
  },
};
