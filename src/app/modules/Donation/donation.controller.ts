import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createDonation, deleteDonation, donationSummary, listDonations, updateDonation } from "./donation.service";

export const donationController = {
  async list(req: Request, res: Response): Promise<void> {
    const items = await listDonations({
      year: typeof req.query.year === "string" ? req.query.year : undefined,
      month: typeof req.query.month === "string" ? req.query.month : undefined,
      q: typeof req.query.q === "string" ? req.query.q : undefined,
    });
    ok(res, items, msg.loaded("Donations", items.length));
  },
  async summary(req: Request, res: Response): Promise<void> {
    ok(
      res,
      await donationSummary({
        year: typeof req.query.year === "string" ? req.query.year : undefined,
        month: typeof req.query.month === "string" ? req.query.month : undefined,
      }),
      msg.loaded("Donation summary")
    );
  },
  async create(req: Request, res: Response): Promise<void> {
    ok(res, await createDonation(req.body, req.user), msg.saved("Donation"), 201);
  },
  async update(req: Request, res: Response): Promise<void> {
    ok(res, await updateDonation(routeParam(req.params.id), req.body), msg.updated("Donation"));
  },
  async remove(req: Request, res: Response): Promise<void> {
    ok(res, await deleteDonation(routeParam(req.params.id)), msg.deleted("Donation"));
  },
};
