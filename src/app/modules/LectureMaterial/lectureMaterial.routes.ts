import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { lectureMaterialController } from "./lectureMaterial.controller";

const router = Router();

router.get("/public/lecture-materials", asyncHandler(lectureMaterialController.publicList));

router.get(
  "/lecture-materials",
  authenticate,
  authorize("teachers:view"),
  requireFeature("teachers"),
  asyncHandler(lectureMaterialController.list)
);

router.post(
  "/lecture-materials",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  asyncHandler(lectureMaterialController.create)
);

router.patch(
  "/lecture-materials/:id",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  asyncHandler(lectureMaterialController.update)
);

router.delete(
  "/lecture-materials/:id",
  authenticate,
  authorize("teachers:edit"),
  requireFeature("teachers"),
  asyncHandler(lectureMaterialController.remove)
);

export const lectureMaterialRouter = router;
