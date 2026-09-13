import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { routineController } from "./routine.controller";
import { routineSlotValidation } from "./routine.validation";

const router = Router();

router.get("/routines", authenticate, authorize("academics:view"), requireFeature("academics"), asyncHandler(routineController.list));
router.post(
  "/routines",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(routineSlotValidation),
  asyncHandler(routineController.save)
);
router.delete(
  "/routines/:id",
  authenticate,
  authorize("academics:delete"),
  requireFeature("academics"),
  asyncHandler(routineController.remove)
);

export const routineRouter = router;
