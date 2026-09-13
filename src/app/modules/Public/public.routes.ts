import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { requireRole } from "../../../middleware/authorize";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { publicController } from "./public.controller";
import { publicAdmissionValidation } from "./public.validation";

const router = Router();

router.get("/public/branding", asyncHandler(publicController.branding));
router.get("/public/classes", asyncHandler(publicController.classes));
router.post("/public/admissions", validate(publicAdmissionValidation), asyncHandler(publicController.apply));
router.get(
  "/portal/guardian",
  authenticate,
  requireRole("guardian", "school_admin", "platform_owner"),
  asyncHandler(publicController.guardian)
);
router.get(
  "/portal/teacher",
  authenticate,
  requireRole("teacher", "school_admin", "platform_owner"),
  asyncHandler(publicController.teacher)
);

export const publicRouter = router;
