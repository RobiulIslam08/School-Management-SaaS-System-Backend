import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { teacherController } from "./teacher.controller";
import { teacherCreateValidation, teacherUpdateValidation } from "./teacher.validation";

const router = Router();

router.get("/teachers", authenticate, authorize("teachers:view"), requireFeature("teachers"), asyncHandler(teacherController.list));
router.post(
  "/teachers",
  authenticate,
  authorize("teachers:create"),
  requireFeature("teachers"),
  validate(teacherCreateValidation),
  asyncHandler(teacherController.create)
);
router.patch(
  "/teachers/:id",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  validate(teacherUpdateValidation),
  asyncHandler(teacherController.update)
);

export const teachersRouter = router;
