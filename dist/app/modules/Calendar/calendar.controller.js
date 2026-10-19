"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const persist_1 = require("../../../utils/persist");
const calendar_service_1 = require("./calendar.service");
exports.calendarController = {
    async list(req, res) {
        const { academicYear, month, year, type } = req.query;
        const items = await (0, calendar_service_1.listCalendarEvents)({ academicYear, month, year, type });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Calendar events", items.length));
    },
    async create(req, res) {
        const event = await (0, calendar_service_1.createCalendarEvent)({ ...req.body, createdBy: req.user?.id });
        (0, respond_1.ok)(res, event, messages_1.msg.saved("Calendar event"), 201);
    },
    async update(req, res) {
        const event = await (0, calendar_service_1.updateCalendarEvent)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, event, messages_1.msg.updated("Calendar event"));
    },
    async remove(req, res) {
        const data = await (0, calendar_service_1.deleteCalendarEvent)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, data, messages_1.msg.deleted("Calendar event"));
    },
    async publicList(req, res) {
        const year = typeof req.query.year === "string" ? req.query.year : undefined;
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        const items = await (0, calendar_service_1.listPublicCalendarEvents)(year);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Calendar events", items.length));
    },
};
