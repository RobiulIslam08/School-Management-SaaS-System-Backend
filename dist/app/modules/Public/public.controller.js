"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const public_service_1 = require("./public.service");
exports.publicController = {
    async branding(_req, res) {
        (0, respond_1.ok)(res, await (0, public_service_1.publicBranding)(), messages_1.msg.loaded("School branding"));
    },
    async classes(_req, res) {
        const items = await (0, public_service_1.publicClasses)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Admission classes", items.length));
    },
    async apply(req, res) {
        const created = await (0, public_service_1.publicAdmission)(req.body);
        (0, respond_1.ok)(res, { studentId: created.studentId }, messages_1.msg.saved("Admission application"), 201);
    },
    async guardian(req, res) {
        const data = await (0, public_service_1.guardianPortal)(req.user.id, req.user?.role, req.query.studentId);
        (0, respond_1.ok)(res, data, messages_1.msg.loaded("Guardian portal"));
    },
    async teacher(req, res) {
        const data = await (0, public_service_1.teacherPortal)(req.user.id);
        (0, respond_1.ok)(res, data, messages_1.msg.loaded("Teacher portal"));
    },
};
