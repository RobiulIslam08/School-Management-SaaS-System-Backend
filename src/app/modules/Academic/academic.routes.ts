import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { academicController } from "./academic.controller";
import {
  classCreateValidation,
  classUpdateValidation,
  subjectCreateValidation,
  subjectUpdateValidation,
} from "./academic.validation";

const router = Router();
const viewGate = [authenticate, authorize("academics:view"), requireFeature("academics")] as const;

router.get("/classes", ...viewGate, asyncHandler(academicController.listClasses));
router.post(
  "/classes",
  authenticate,
  authorize("academics:create"),
  requireFeature("academics"),
  validate(classCreateValidation),
  asyncHandler(academicController.createClass)
);
router.patch(
  "/classes/:id",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(classUpdateValidation),
  asyncHandler(academicController.updateClass)
);
router.get("/subjects", ...viewGate, asyncHandler(academicController.listSubjects));
router.post(
  "/subjects",
  authenticate,
  authorize("academics:create"),
  requireFeature("academics"),
  validate(subjectCreateValidation),
  asyncHandler(academicController.createSubject)
);
router.patch(
  "/subjects/:id",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(subjectUpdateValidation),
  asyncHandler(academicController.updateSubject)
);

export const academicRouter = router;
