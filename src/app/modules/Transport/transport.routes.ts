import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { transportController } from "./transport.controller";
import { transportCreateValidation, transportUpdateValidation } from "./transport.validation";

const router = Router();

router.get("/transport", authenticate, authorize("transport:view"), requireFeature("transport"), asyncHandler(transportController.list));
router.post(
  "/transport",
  authenticate,
  authorize("transport:create"),
  requireFeature("transport"),
  validate(transportCreateValidation),
  asyncHandler(transportController.create)
);
router.patch(
  "/transport/:id",
  authenticate,
  authorize("transport:edit"),
  requireFeature("transport"),
  validate(transportUpdateValidation),
  asyncHandler(transportController.update)
);
router.delete(
  "/transport/:id",
  authenticate,
  authorize("transport:delete"),
  requireFeature("transport"),
  asyncHandler(transportController.remove)
);

export const transportRouter = router;
