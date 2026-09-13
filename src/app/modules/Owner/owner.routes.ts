import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../../middleware/authenticate";
import { requireRole } from "../../../middleware/authorize";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ownerController } from "./owner.controller";
import { ownerPackageValidation } from "./owner.validation";

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 });
const ownerOnly = [limiter, authenticate, requireRole("platform_owner")] as const;

router.get("/owner/packages", ...ownerOnly, asyncHandler(ownerController.getPackages));
router.patch(
  "/owner/packages",
  ...ownerOnly,
  validate(ownerPackageValidation),
  asyncHandler(ownerController.updatePackages)
);

export const ownerRouter = router;
