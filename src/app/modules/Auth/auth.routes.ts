import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../../middleware/authenticate";
import { requireRole } from "../../../middleware/authorize";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { authController } from "./auth.controller";
import { forgotPasswordValidation, loginValidation, resetPasswordValidation, twoFactorValidation } from "./auth.validation";

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true });
const resetLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true });

router.post("/auth/login", limiter, validate(loginValidation), asyncHandler(authController.login));
router.post("/owner/login", limiter, validate(loginValidation), asyncHandler(authController.ownerLogin));
router.post("/auth/2fa", limiter, validate(twoFactorValidation), asyncHandler(authController.verify2fa));
router.post(
  "/auth/forgot-password",
  resetLimiter,
  validate(forgotPasswordValidation),
  asyncHandler(authController.forgotPassword)
);
router.post(
  "/owner/forgot-password",
  resetLimiter,
  validate(forgotPasswordValidation),
  asyncHandler(authController.ownerForgotPassword)
);
router.post(
  "/auth/reset-password",
  resetLimiter,
  validate(resetPasswordValidation),
  asyncHandler(authController.resetPassword)
);
router.post(
  "/owner/reset-password",
  resetLimiter,
  validate(resetPasswordValidation),
  asyncHandler(authController.ownerResetPassword)
);
router.post("/auth/refresh", asyncHandler(authController.refresh));
router.post("/auth/logout", asyncHandler(authController.logout));
router.get("/auth/me", authenticate, asyncHandler(authController.me));
router.post("/owner/2fa/setup", authenticate, requireRole("platform_owner"), asyncHandler(authController.setup2fa));

export const authRouter = router;
