import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { studentController } from "./student.controller";
import { promoteValidation, studentCreateValidation, studentUpdateValidation } from "./student.validation";

const router = Router();

router.get("/students", authenticate, authorize("students:view"), requireFeature("students"), asyncHandler(studentController.list));
router.get("/students/:id", authenticate, authorize("students:view"), requireFeature("students"), asyncHandler(studentController.get));
router.post(
  "/students",
  authenticate,
  authorize("students:create"),
  requireFeature("admission"),
  validate(studentCreateValidation),
  asyncHandler(studentController.create)
);
router.patch(
  "/students/:id",
  authenticate,
  authorize("students:edit"),
  requireFeature("students"),
  validate(studentUpdateValidation),
  asyncHandler(studentController.update)
);
router.post(
  "/students/promote",
  authenticate,
  authorize("students:approve"),
  requireFeature("students"),
  validate(promoteValidation),
  asyncHandler(studentController.promote)
);

export const studentsRouter = router;
