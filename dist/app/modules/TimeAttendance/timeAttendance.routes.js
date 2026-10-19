"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeAttendanceRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middleware/authenticate");
const authorize_1 = require("../../../middleware/authorize");
const requireFeature_1 = require("../../../middleware/requireFeature");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const timeAttendance_controller_1 = require("./timeAttendance.controller");
const router = (0, express_1.Router)();
// Machine push webhook - can be authenticated via machine token or open webhook
router.post("/time-attendance/push", (0, asyncHandler_1.asyncHandler)(timeAttendance_controller_1.timeAttendanceController.pushPunches));
router.get("/time-attendance/logs", authenticate_1.authenticate, (0, authorize_1.authorize)("attendance:view"), (0, requireFeature_1.requireFeature)("attendance"), (0, asyncHandler_1.asyncHandler)(timeAttendance_controller_1.timeAttendanceController.listLogs));
router.get("/time-attendance/mappings", authenticate_1.authenticate, (0, authorize_1.authorize)("attendance:view"), (0, requireFeature_1.requireFeature)("attendance"), (0, asyncHandler_1.asyncHandler)(timeAttendance_controller_1.timeAttendanceController.listMappings));
router.post("/time-attendance/mappings", authenticate_1.authenticate, (0, authorize_1.authorize)("attendance:edit"), (0, requireFeature_1.requireFeature)("attendance"), (0, asyncHandler_1.asyncHandler)(timeAttendance_controller_1.timeAttendanceController.upsertMapping));
router.delete("/time-attendance/mappings/:id", authenticate_1.authenticate, (0, authorize_1.authorize)("attendance:edit"), (0, requireFeature_1.requireFeature)("attendance"), (0, asyncHandler_1.asyncHandler)(timeAttendance_controller_1.timeAttendanceController.deleteMapping));
exports.timeAttendanceRouter = router;
