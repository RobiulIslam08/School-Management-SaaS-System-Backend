import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { asyncHandler } from "../../../utils/asyncHandler";
import { calendarController } from "./calendar.controller";

const router = Router();

router.get(
  "/calendar-events",
  authenticate,
  authorize("academics:view"),
  requireFeature("academics"),
  asyncHandler(calendarController.list)
);

router.post(
  "/calendar-events",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  asyncHandler(calendarController.create)
);

router.patch(
  "/calendar-events/:id",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  asyncHandler(calendarController.update)
);

router.delete(
  "/calendar-events/:id",
  authenticate,
  authorize("academics:edit"),
  requireFeature("academics"),
  asyncHandler(calendarController.remove)
);

router.get("/public/calendar-events", asyncHandler(calendarController.publicList));

export const calendarRouter = router;
