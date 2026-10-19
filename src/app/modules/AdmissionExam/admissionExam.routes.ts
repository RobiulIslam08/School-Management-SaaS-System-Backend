import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { admissionExamController } from "./admissionExam.controller";

const router = Router();

// Public result search
router.get("/public/admission-exam-results", asyncHandler(admissionExamController.searchPublic));

// Protected admin routes
router.get(
  "/admission-exams",
  authenticate,
  authorize("students:view"),
  requireFeature("students"),
  asyncHandler(admissionExamController.listExams)
);

router.post(
  "/admission-exams",
  authenticate,
  authorize("students:create"),
  requireFeature("students"),
  asyncHandler(admissionExamController.createExam)
);

router.patch(
  "/admission-exams/:id",
  authenticate,
  authorize("students:edit"),
  requireFeature("students"),
  asyncHandler(admissionExamController.updateExam)
);

router.delete(
  "/admission-exams/:id",
  authenticate,
  authorize("students:delete"),
  requireFeature("students"),
  asyncHandler(admissionExamController.deleteExam)
);

router.patch(
  "/admission-exams/:id/publish",
  authenticate,
  authorize("students:edit"),
  requireFeature("students"),
  asyncHandler(admissionExamController.publishExam)
);

router.get(
  "/admission-exams/:examId/results",
  authenticate,
  authorize("students:view"),
  requireFeature("students"),
  asyncHandler(admissionExamController.listResults)
);

router.post(
  "/admission-exams/:examId/results",
  authenticate,
  authorize("students:edit"),
  requireFeature("students"),
  asyncHandler(admissionExamController.upsertResult)
);

router.post(
  "/admission-exams/:examId/results/bulk",
  authenticate,
  authorize("students:edit"),
  requireFeature("students"),
  asyncHandler(admissionExamController.bulkSaveResults)
);

export const admissionExamRouter = router;
