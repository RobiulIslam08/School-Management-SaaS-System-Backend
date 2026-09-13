import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { subjectController } from "./subject.controller";
import {
  subjectCreateValidation,
  subjectReorderValidation,
  subjectTeacherValidation,
  subjectUpdateValidation,
} from "./subject.validation";

const router = Router();
const view = [authenticate, authorize("academics:view"), requireFeature("academics")] as const;

router.get("/subjects", ...view, asyncHandler(subjectController.list));
router.post(
  "/subjects",
  authenticate,
  authorize("academics:create"),
  requireFeature("academics"),
  validate(subjectCreateValidation),
  asyncHandler(subjectController.create)
);
router.patch(
  "/subjects/reorder",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(subjectReorderValidation),
  asyncHandler(subjectController.reorder)
);
router.patch(
  "/subjects/:id",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(subjectUpdateValidation),
  asyncHandler(subjectController.update)
);
router.patch(
  "/subjects/:id/teacher",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(subjectTeacherValidation),
  asyncHandler(subjectController.teacher)
);
router.delete(
  "/subjects/:id",
  authenticate,
  authorize("academics:delete"),
  requireFeature("academics"),
  asyncHandler(subjectController.remove)
);

export const subjectRouter = router;
