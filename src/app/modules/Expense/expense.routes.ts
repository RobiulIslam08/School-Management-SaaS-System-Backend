import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { expenseController } from "./expense.controller";
import { expenseCreateValidation, expenseUpdateValidation } from "./expense.validation";

const router = Router();

router.get("/expenses", authenticate, authorize("expenses:view"), requireFeature("expenses"), asyncHandler(expenseController.list));
router.get(
  "/expenses/summary",
  authenticate,
  authorize("expenses:view"),
  requireFeature("expenses"),
  asyncHandler(expenseController.summary)
);
router.post(
  "/expenses",
  authenticate,
  authorize("expenses:create"),
  requireFeature("expenses"),
  validate(expenseCreateValidation),
  asyncHandler(expenseController.create)
);
router.patch(
  "/expenses/:id",
  authenticate,
  authorize("expenses:edit"),
  requireFeature("expenses"),
  validate(expenseUpdateValidation),
  asyncHandler(expenseController.update)
);
router.delete(
  "/expenses/:id",
  authenticate,
  authorize("expenses:delete"),
  requireFeature("expenses"),
  asyncHandler(expenseController.remove)
);

export const expenseRouter = router;
