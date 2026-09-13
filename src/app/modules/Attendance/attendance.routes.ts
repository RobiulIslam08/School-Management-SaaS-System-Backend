import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { attendanceController } from "./attendance.controller";
import { attendanceBulkValidation } from "./attendance.validation";

const router = Router();

router.get("/attendance", authenticate, authorize("attendance:view"), requireFeature("attendance"), asyncHandler(attendanceController.list));
router.post(
  "/attendance/bulk",
  authenticate,
  authorize("attendance:create"),
  requireFeature("attendance"),
  validate(attendanceBulkValidation),
  asyncHandler(attendanceController.bulk)
);
router.get(
  "/attendance/roster",
  authenticate,
  authorize("attendance:view"),
  requireFeature("attendance"),
  asyncHandler(attendanceController.roster)
);
router.get(
  "/attendance/dates",
  authenticate,
  authorize("attendance:view"),
  requireFeature("attendance"),
  asyncHandler(attendanceController.dates)
);

export const attendanceRouter = router;
