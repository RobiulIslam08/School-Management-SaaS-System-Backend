import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { staffAttendanceController } from "./staffAttendance.controller";
import { staffAttendanceBulkValidation } from "./staffAttendance.validation";

const router = Router();

router.get(
  "/staff-attendance",
  authenticate,
  authorize("staffAttendance:view"),
  requireFeature("staffAttendance"),
  asyncHandler(staffAttendanceController.list)
);
router.get(
  "/staff-attendance/roster",
  authenticate,
  authorize("staffAttendance:view"),
  requireFeature("staffAttendance"),
  asyncHandler(staffAttendanceController.roster)
);
router.get(
  "/staff-attendance/dates",
  authenticate,
  authorize("staffAttendance:view"),
  requireFeature("staffAttendance"),
  asyncHandler(staffAttendanceController.dates)
);
router.post(
  "/staff-attendance/bulk",
  authenticate,
  authorize("staffAttendance:create"),
  requireFeature("staffAttendance"),
  validate(staffAttendanceBulkValidation),
  asyncHandler(staffAttendanceController.bulk)
);

export const staffAttendanceRouter = router;
