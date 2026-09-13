import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { payrollController } from "./payroll.controller";
import { payrollCreateValidation } from "./payroll.validation";

const router = Router();

router.get("/payroll", authenticate, authorize("payroll:view"), requireFeature("payroll"), asyncHandler(payrollController.list));
router.post(
  "/payroll",
  authenticate,
  authorize("payroll:create"),
  requireFeature("payroll"),
  validate(payrollCreateValidation),
  asyncHandler(payrollController.create)
);
router.patch(
  "/payroll/:id/pay",
  authenticate,
  authorize("payroll:approve"),
  requireFeature("payroll"),
  asyncHandler(payrollController.pay)
);

export const payrollRouter = router;
