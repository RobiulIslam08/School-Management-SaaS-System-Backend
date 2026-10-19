import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { timeAttendanceController } from "./timeAttendance.controller";

const router = Router();

// Machine push webhook - can be authenticated via machine token or open webhook
router.post("/time-attendance/push", asyncHandler(timeAttendanceController.pushPunches));

router.get(
  "/time-attendance/logs",
  authenticate,
  authorize("attendance:view"),
  requireFeature("attendance"),
  asyncHandler(timeAttendanceController.listLogs)
);

router.get(
  "/time-attendance/mappings",
  authenticate,
  authorize("attendance:view"),
  requireFeature("attendance"),
  asyncHandler(timeAttendanceController.listMappings)
);

router.post(
  "/time-attendance/mappings",
  authenticate,
  authorize("attendance:edit"),
  requireFeature("attendance"),
  asyncHandler(timeAttendanceController.upsertMapping)
);

router.delete(
  "/time-attendance/mappings/:id",
  authenticate,
  authorize("attendance:edit"),
  requireFeature("attendance"),
  asyncHandler(timeAttendanceController.deleteMapping)
);

export const timeAttendanceRouter = router;
