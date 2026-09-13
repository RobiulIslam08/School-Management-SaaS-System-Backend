import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { reportController } from "./report.controller";

const router = Router();

router.get(
  "/reports/areas",
  authenticate,
  authorize("reports:view"),
  requireFeature("reports"),
  asyncHandler(reportController.areas)
);
router.get(
  "/reports/talent",
  authenticate,
  authorize("talent:view"),
  requireFeature("talent"),
  asyncHandler(reportController.talent)
);
router.get("/dashboard", authenticate, asyncHandler(reportController.dashboard));

export const reportsRouter = router;
