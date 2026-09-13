import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { examController } from "./exam.controller";
import { examCreateValidation, gradingRuleValidation, resultSaveValidation } from "./exam.validation";

const router = Router();

router.get("/exams", authenticate, authorize("exams:view"), requireFeature("exams"), asyncHandler(examController.listExams));
router.post(
  "/exams",
  authenticate,
  authorize("exams:create"),
  requireFeature("exams"),
  validate(examCreateValidation),
  asyncHandler(examController.createExam)
);
router.patch(
  "/exams/:id/publish",
  authenticate,
  authorize("results:approve"),
  requireFeature("exams"),
  asyncHandler(examController.publish)
);
router.get(
  "/grading-rules",
  authenticate,
  authorize("exams:view"),
  requireFeature("exams"),
  asyncHandler(examController.listRules)
);
router.post(
  "/grading-rules",
  authenticate,
  authorize("exams:create"),
  requireFeature("exams"),
  validate(gradingRuleValidation),
  asyncHandler(examController.createRule)
);
router.get("/results", authenticate, authorize("results:view"), requireFeature("results"), asyncHandler(examController.listResults));
router.post(
  "/results",
  authenticate,
  authorize("results:create"),
  requireFeature("results"),
  validate(resultSaveValidation),
  asyncHandler(examController.saveResult)
);
router.post(
  "/results/:examTypeId/merit",
  authenticate,
  authorize("results:approve"),
  requireFeature("results"),
  asyncHandler(examController.merit)
);
router.get(
  "/results/final/:studentId",
  authenticate,
  authorize("results:view"),
  requireFeature("results"),
  asyncHandler(examController.final)
);
router.get(
  "/results/:examTypeId/export",
  authenticate,
  authorize("results:view"),
  requireFeature("results"),
  asyncHandler(examController.exportXlsx)
);

export const examsRouter = router;
