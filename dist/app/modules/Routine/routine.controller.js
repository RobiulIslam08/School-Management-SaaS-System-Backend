"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const routine_service_1 = require("./routine.service");
exports.routineController = {
    async list(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const section = typeof req.query.section === "string" ? req.query.section : undefined;
        const items = await (0, routine_service_1.listRoutine)(classId, section);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Routine", items.length));
    },
    async save(req, res) {
        const saved = await (0, routine_service_1.upsertSlot)(req.body);
        (0, respond_1.ok)(res, saved, messages_1.msg.saved("Routine"));
    },
    async remove(req, res) {
        await (0, routine_service_1.deleteSlot)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, { deleted: true }, messages_1.msg.archived("Routine"));
    },
};
