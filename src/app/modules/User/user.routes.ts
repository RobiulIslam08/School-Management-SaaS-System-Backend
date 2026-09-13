import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { userController } from "./user.controller";
import { createUserValidation, updateUserValidation } from "./user.validation";

const router = Router();

router.get("/users", authenticate, authorize("users:view"), asyncHandler(userController.list));
router.post("/users", authenticate, authorize("users:create"), validate(createUserValidation), asyncHandler(userController.create));
router.patch("/users/:id", authenticate, authorize("users:edit"), validate(updateUserValidation), asyncHandler(userController.update));

export const usersRouter = router;
