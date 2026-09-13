import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { classController } from "./class.controller";
import { classCreateValidation, classUpdateValidation, sectionValidation } from "./class.validation";

const router = Router();
const view = [authenticate, authorize("academics:view"), requireFeature("academics")] as const;

router.get("/classes", ...view, asyncHandler(classController.list));
router.get("/classes/:id/workspace", ...view, asyncHandler(classController.workspace));
router.post(
  "/classes",
  authenticate,
  authorize("academics:create"),
  requireFeature("academics"),
  validate(classCreateValidation),
  asyncHandler(classController.create)
);
router.patch(
  "/classes/:id",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(classUpdateValidation),
  asyncHandler(classController.update)
);
router.post(
  "/classes/:id/archive",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  asyncHandler(classController.archive)
);
router.delete(
  "/classes/:id",
  authenticate,
  authorize("academics:delete"),
  requireFeature("academics"),
  asyncHandler(classController.remove)
);
router.post(
  "/classes/:id/sections",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  validate(sectionValidation),
  asyncHandler(classController.saveSection)
);
router.delete(
  "/classes/:id/sections",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  asyncHandler(classController.deleteSection)
);

export const classRouter = router;
