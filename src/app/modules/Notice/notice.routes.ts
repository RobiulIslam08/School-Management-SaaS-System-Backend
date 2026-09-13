import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { noticeController } from "./notice.controller";
import { noticeCreateValidation, noticeUpdateValidation } from "./notice.validation";

const router = Router();

router.get("/notices", authenticate, authorize("notices:view"), requireFeature("notices"), asyncHandler(noticeController.list));
router.post(
  "/notices",
  authenticate,
  authorize("notices:create"),
  requireFeature("notices"),
  validate(noticeCreateValidation),
  asyncHandler(noticeController.create)
);
router.patch(
  "/notices/:id",
  authenticate,
  authorize("notices:edit"),
  requireFeature("notices"),
  validate(noticeUpdateValidation),
  asyncHandler(noticeController.update)
);
router.delete(
  "/notices/:id",
  authenticate,
  authorize("notices:delete"),
  requireFeature("notices"),
  asyncHandler(noticeController.remove)
);

export const noticeRouter = router;
