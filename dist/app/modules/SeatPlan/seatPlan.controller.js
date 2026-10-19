"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seatPlanController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const persist_1 = require("../../../utils/persist");
const seatPlan_service_1 = require("./seatPlan.service");
exports.seatPlanController = {
    async get(req, res) {
        const examId = (0, persist_1.routeParam)(req.params.examId);
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const section = typeof req.query.section === "string" ? req.query.section : undefined;
        const plan = await (0, seatPlan_service_1.getSeatPlan)(examId, classId, section);
        (0, respond_1.ok)(res, plan, messages_1.msg.loaded("Seat plan", plan ? 1 : 0));
    },
    async generate(req, res) {
        const plan = await (0, seatPlan_service_1.generateSeatPlan)(req.body);
        (0, respond_1.ok)(res, plan, messages_1.msg.saved("Seat plan"), 201);
    },
    async update(req, res) {
        const plan = await (0, seatPlan_service_1.saveSeatPlan)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, plan, messages_1.msg.updated("Seat plan"));
    },
    async remove(req, res) {
        const result = await (0, seatPlan_service_1.deleteSeatPlan)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Seat plan"));
    },
};
