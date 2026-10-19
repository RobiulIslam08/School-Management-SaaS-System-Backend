import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { ok } from "../../../utils/respond";
import { routeParam } from "../../../utils/persist";
import {
  deleteDeviceMapping,
  listDeviceMappings,
  listTimeLogs,
  pushPunches,
  upsertDeviceMapping,
} from "./timeAttendance.service";

export const timeAttendanceController = {
  async pushPunches(req: Request, res: Response): Promise<void> {
    const { deviceId, punches } = req.body;
    const result = await pushPunches(deviceId, punches);
    ok(res, result, msg.saved(`Time attendance punches (${result.count})`), 201);
  },

  async listLogs(req: Request, res: Response): Promise<void> {
    const date = typeof req.query.date === "string" ? req.query.date : undefined;
    const deviceId = typeof req.query.deviceId === "string" ? req.query.deviceId : undefined;
    const staffId = typeof req.query.staffId === "string" ? req.query.staffId : undefined;
    const items = await listTimeLogs({ date, deviceId, staffId });
    ok(res, items, msg.loaded("Attendance logs", items.length));
  },

  async listMappings(req: Request, res: Response): Promise<void> {
    const deviceId = typeof req.query.deviceId === "string" ? req.query.deviceId : undefined;
    const items = await listDeviceMappings(deviceId);
    ok(res, items, msg.loaded("Device mappings", items.length));
  },

  async upsertMapping(req: Request, res: Response): Promise<void> {
    const item = await upsertDeviceMapping(req.body);
    ok(res, item, msg.saved("Device mapping"));
  },

  async deleteMapping(req: Request, res: Response): Promise<void> {
    const result = await deleteDeviceMapping(routeParam(req.params.id));
    ok(res, result, msg.deleted("Device mapping"));
  },
};
