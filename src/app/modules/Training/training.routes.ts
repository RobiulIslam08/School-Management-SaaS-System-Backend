import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { trainingController } from "./training.controller";

const router = Router();

router.get(
  "/trainings",
  authenticate,
  authorize("teachers:view"),
  requireFeature("teachers"),
  asyncHandler(trainingController.list)
);

router.post(
  "/trainings",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  asyncHandler(trainingController.create)
);

router.patch(
  "/trainings/:id",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  asyncHandler(trainingController.update)
);

router.delete(
  "/trainings/:id",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  asyncHandler(trainingController.remove)
);

router.patch(
  "/trainings/:id/attendance",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  asyncHandler(trainingController.updateAttendance)
);

export const trainingRouter = router;
