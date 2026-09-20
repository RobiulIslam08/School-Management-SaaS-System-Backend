import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { donationController } from "./donation.controller";
import { donationCreateValidation, donationUpdateValidation } from "./donation.validation";

const router = Router();

router.get("/donations", authenticate, authorize("donations:view"), requireFeature("donations"), asyncHandler(donationController.list));
router.get(
  "/donations/summary",
  authenticate,
  authorize("donations:view"),
  requireFeature("donations"),
  asyncHandler(donationController.summary)
);
router.post(
  "/donations",
  authenticate,
  authorize("donations:create"),
  requireFeature("donations"),
  validate(donationCreateValidation),
  asyncHandler(donationController.create)
);
router.patch(
  "/donations/:id",
  authenticate,
  authorize("donations:edit"),
  requireFeature("donations"),
  validate(donationUpdateValidation),
  asyncHandler(donationController.update)
);
router.delete(
  "/donations/:id",
  authenticate,
  authorize("donations:delete"),
  requireFeature("donations"),
  asyncHandler(donationController.remove)
);

export const donationRouter = router;
