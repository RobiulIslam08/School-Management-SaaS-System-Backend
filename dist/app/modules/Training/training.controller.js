"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const persist_1 = require("../../../utils/persist");
const training_service_1 = require("./training.service");
exports.trainingController = {
    async list(req, res) {
        const status = typeof req.query.status === "string" ? req.query.status : undefined;
        const items = await (0, training_service_1.listTrainings)(status);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Trainings", items.length));
    },
    async create(req, res) {
        const item = await (0, training_service_1.createTraining)(req.body);
        (0, respond_1.ok)(res, item, messages_1.msg.saved("Training session"), 201);
    },
    async update(req, res) {
        const item = await (0, training_service_1.updateTraining)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, item, messages_1.msg.updated("Training session"));
    },
    async remove(req, res) {
        const result = await (0, training_service_1.deleteTraining)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Training session"));
    },
    async updateAttendance(req, res) {
        const participants = Array.isArray(req.body.participants) ? req.body.participants : [];
        const item = await (0, training_service_1.updateTrainingAttendance)((0, persist_1.routeParam)(req.params.id), participants);
        (0, respond_1.ok)(res, item, messages_1.msg.updated("Training attendance"));
    },
};
