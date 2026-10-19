"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCalendarEvents = listCalendarEvents;
exports.createCalendarEvent = createCalendarEvent;
exports.updateCalendarEvent = updateCalendarEvent;
exports.deleteCalendarEvent = deleteCalendarEvent;
exports.listPublicCalendarEvents = listPublicCalendarEvents;
const CalendarEvent_1 = require("../../../models/CalendarEvent");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function listCalendarEvents(filter) {
    const query = {};
    if (filter.academicYear)
        query.academicYear = filter.academicYear;
    if (filter.type)
        query.type = filter.type;
    if (filter.year && filter.month) {
        const y = parseInt(filter.year);
        const m = parseInt(filter.month) - 1;
        query.date = { $gte: new Date(y, m, 1), $lt: new Date(y, m + 1, 1) };
    }
    else if (filter.year) {
        const y = parseInt(filter.year);
        query.date = { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) };
    }
    return CalendarEvent_1.CalendarEvent.find(query).sort({ date: 1 });
}
async function createCalendarEvent(body) {
    return CalendarEvent_1.CalendarEvent.create(body);
}
async function updateCalendarEvent(id, body) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Event", "ID is required."));
    const event = await CalendarEvent_1.CalendarEvent.findById(id);
    if (!event)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Calendar event"));
    Object.assign(event, body);
    await event.save();
    return event;
}
async function deleteCalendarEvent(id) {
    if (!id)
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("Event", "ID is required."));
    const event = await CalendarEvent_1.CalendarEvent.findByIdAndDelete(id);
    if (!event)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Calendar event"));
    return { deleted: true };
}
async function listPublicCalendarEvents(year) {
    const query = { isPublic: true };
    if (year) {
        const y = parseInt(year);
        query.date = { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) };
    }
    return CalendarEvent_1.CalendarEvent.find(query).sort({ date: 1 }).select("title titleBn date endDate type description");
}
