import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { seatPlanController } from "./seatPlan.controller";

const router = Router();

router.get(
  "/seat-plans/:examId",
  authenticate,
  authorize("exams:view"),
  requireFeature("exams"),
  asyncHandler(seatPlanController.get)
);

router.post(
  "/seat-plans/generate",
  authenticate,
  authorize("exams:edit"),
  requireFeature("exams"),
  asyncHandler(seatPlanController.generate)
);

router.patch(
  "/seat-plans/:id",
  authenticate,
  authorize("exams:edit"),
  requireFeature("exams"),
  asyncHandler(seatPlanController.update)
);

router.delete(
  "/seat-plans/:id",
  authenticate,
  authorize("exams:delete"),
  requireFeature("exams"),
  asyncHandler(seatPlanController.remove)
);

export const seatPlanRouter = router;
