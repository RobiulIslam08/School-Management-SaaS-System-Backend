import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { accountsController } from "./accounts.controller";

const router = Router();

router.get(
  "/accounts/summary",
  authenticate,
  authorize("accounts:view"),
  requireFeature("accounts"),
  asyncHandler(accountsController.summary)
);

export const accountsRouter = router;
