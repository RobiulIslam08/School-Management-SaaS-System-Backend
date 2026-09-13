import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { smsController } from "./sms.controller";
import { smsSendValidation } from "./sms.validation";

const router = Router();

router.get("/sms", authenticate, authorize("sms:view"), requireFeature("sms"), asyncHandler(smsController.list));
router.post(
  "/sms",
  authenticate,
  authorize("sms:create"),
  requireFeature("sms"),
  validate(smsSendValidation),
  asyncHandler(smsController.send)
);

export const smsRouter = router;
