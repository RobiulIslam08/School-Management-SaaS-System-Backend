import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { requireFeature } from "../../../middleware/requireFeature";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { libraryController } from "./library.controller";
import { bookCreateValidation, bookIssueValidation, bookUpdateValidation } from "./library.validation";

const router = Router();

router.get("/library/books", authenticate, authorize("library:view"), requireFeature("library"), asyncHandler(libraryController.listBooks));
router.post(
  "/library/books",
  authenticate,
  authorize("library:create"),
  requireFeature("library"),
  validate(bookCreateValidation),
  asyncHandler(libraryController.createBook)
);
router.patch(
  "/library/books/:id",
  authenticate,
  authorize("library:edit"),
  requireFeature("library"),
  validate(bookUpdateValidation),
  asyncHandler(libraryController.updateBook)
);
router.delete(
  "/library/books/:id",
  authenticate,
  authorize("library:delete"),
  requireFeature("library"),
  asyncHandler(libraryController.removeBook)
);
router.get("/library/issues", authenticate, authorize("library:view"), requireFeature("library"), asyncHandler(libraryController.listIssues));
router.post(
  "/library/issues",
  authenticate,
  authorize("library:create"),
  requireFeature("library"),
  validate(bookIssueValidation),
  asyncHandler(libraryController.issue)
);
router.patch(
  "/library/issues/:id/return",
  authenticate,
  authorize("library:edit"),
  requireFeature("library"),
  asyncHandler(libraryController.returnIssue)
);

export const libraryRouter = router;
