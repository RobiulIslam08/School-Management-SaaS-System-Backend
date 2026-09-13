import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { certificateController } from "./certificate.controller";
import { issueCertificateValidation, updateTemplateValidation } from "./certificate.validation";

const router = Router();

router.get(
  "/certificates/templates",
  authenticate,
  authorize("certificates:view"),
  requireFeature("certificates"),
  asyncHandler(certificateController.listTemplates)
);
router.patch(
  "/certificates/templates/:id",
  authenticate,
  authorize("certificates:edit"),
  requireFeature("certificates"),
  validate(updateTemplateValidation),
  asyncHandler(certificateController.updateTemplate)
);
router.get(
  "/certificates",
  authenticate,
  authorize("certificates:view"),
  requireFeature("certificates"),
  asyncHandler(certificateController.listIssued)
);
router.get(
  "/certificates/:id",
  authenticate,
  authorize("certificates:view"),
  requireFeature("certificates"),
  asyncHandler(certificateController.getIssued)
);
router.post(
  "/certificates",
  authenticate,
  authorize("certificates:create"),
  requireFeature("certificates"),
  validate(issueCertificateValidation),
  asyncHandler(certificateController.issue)
);

export const certificateRouter = router;
