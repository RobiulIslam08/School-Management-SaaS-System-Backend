import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { feeController } from "./fee.controller";
import { feeLedgerValidation, feeStructureValidation, paymentValidation } from "./fee.validation";

const router = Router();

router.get("/fees/structures", authenticate, authorize("fees:view"), requireFeature("fees"), asyncHandler(feeController.listStructures));
router.post(
  "/fees/structures",
  authenticate,
  authorize("fees:create"),
  requireFeature("fees"),
  validate(feeStructureValidation),
  asyncHandler(feeController.createStructure)
);
router.get("/fees/ledgers", authenticate, authorize("fees:view"), requireFeature("fees"), asyncHandler(feeController.listLedgers));
router.post(
  "/fees/ledgers",
  authenticate,
  authorize("fees:create"),
  requireFeature("fees"),
  validate(feeLedgerValidation),
  asyncHandler(feeController.createLedger)
);
router.post(
  "/fees/ledgers/:id/payments",
  authenticate,
  authorize("fees:create"),
  requireFeature("fees"),
  validate(paymentValidation),
  asyncHandler(feeController.pay)
);
router.get("/fees/summary", authenticate, authorize("fees:view"), requireFeature("fees"), asyncHandler(feeController.summary));
router.delete(
  "/fees/ledgers/:id",
  authenticate,
  authorize("fees:delete"),
  requireFeature("fees"),
  asyncHandler(feeController.archive)
);

export const feesRouter = router;
