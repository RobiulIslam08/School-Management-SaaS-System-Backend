import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { hostelController } from "./hostel.controller";
import { hostelCreateValidation, hostelUpdateValidation } from "./hostel.validation";

const router = Router();

router.get("/hostels", authenticate, authorize("hostel:view"), requireFeature("hostel"), asyncHandler(hostelController.list));
router.post(
  "/hostels",
  authenticate,
  authorize("hostel:create"),
  requireFeature("hostel"),
  validate(hostelCreateValidation),
  asyncHandler(hostelController.create)
);
router.patch(
  "/hostels/:id",
  authenticate,
  authorize("hostel:edit"),
  requireFeature("hostel"),
  validate(hostelUpdateValidation),
  asyncHandler(hostelController.update)
);
router.delete(
  "/hostels/:id",
  authenticate,
  authorize("hostel:delete"),
  requireFeature("hostel"),
  asyncHandler(hostelController.remove)
);

export const hostelRouter = router;
