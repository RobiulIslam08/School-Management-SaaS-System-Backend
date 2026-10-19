"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionExamRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middleware/authenticate");
const authorize_1 = require("../../../middleware/authorize");
const requireFeature_1 = require("../../../middleware/requireFeature");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const admissionExam_controller_1 = require("./admissionExam.controller");
const router = (0, express_1.Router)();
// Public result search
router.get("/public/admission-exam-results", (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.searchPublic));
// Protected admin routes
router.get("/admission-exams", authenticate_1.authenticate, (0, authorize_1.authorize)("students:view"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.listExams));
router.post("/admission-exams", authenticate_1.authenticate, (0, authorize_1.authorize)("students:create"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.createExam));
router.patch("/admission-exams/:id", authenticate_1.authenticate, (0, authorize_1.authorize)("students:edit"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.updateExam));
router.delete("/admission-exams/:id", authenticate_1.authenticate, (0, authorize_1.authorize)("students:delete"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.deleteExam));
router.patch("/admission-exams/:id/publish", authenticate_1.authenticate, (0, authorize_1.authorize)("students:edit"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.publishExam));
router.get("/admission-exams/:examId/results", authenticate_1.authenticate, (0, authorize_1.authorize)("students:view"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.listResults));
router.post("/admission-exams/:examId/results", authenticate_1.authenticate, (0, authorize_1.authorize)("students:edit"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.upsertResult));
router.post("/admission-exams/:examId/results/bulk", authenticate_1.authenticate, (0, authorize_1.authorize)("students:edit"), (0, requireFeature_1.requireFeature)("students"), (0, asyncHandler_1.asyncHandler)(admissionExam_controller_1.admissionExamController.bulkSaveResults));
exports.admissionExamRouter = router;
