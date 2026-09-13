import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { settingsController } from "./settings.controller";
import { settingsUpdateValidation } from "./settings.validation";

const router = Router();

router.get("/settings", authenticate, authorize("settings:view"), requireFeature("settings"), asyncHandler(settingsController.get));
router.patch(
  "/settings",
  authenticate,
  authorize("settings:edit"),
  requireFeature("settings"),
  validate(settingsUpdateValidation),
  asyncHandler(settingsController.update)
);

export const settingsRouter = router;
