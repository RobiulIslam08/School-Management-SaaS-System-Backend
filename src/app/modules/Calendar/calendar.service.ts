import { CalendarEvent } from "../../../models/CalendarEvent";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";

export async function listCalendarEvents(filter: { academicYear?: string; month?: string; year?: string; type?: string }) {
  const query: Record<string, unknown> = {};
  if (filter.academicYear) query.academicYear = filter.academicYear;
  if (filter.type) query.type = filter.type;
  if (filter.year && filter.month) {
    const y = parseInt(filter.year);
    const m = parseInt(filter.month) - 1;
    query.date = { $gte: new Date(y, m, 1), $lt: new Date(y, m + 1, 1) };
  } else if (filter.year) {
    const y = parseInt(filter.year);
    query.date = { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) };
  }
  return CalendarEvent.find(query).sort({ date: 1 });
}

export async function createCalendarEvent(body: Record<string, unknown>) {
  return CalendarEvent.create(body);
}

export async function updateCalendarEvent(id: string | undefined, body: Record<string, unknown>) {
  if (!id) throw new ApiError(400, msg.invalid("Event", "ID is required."));
  const event = await CalendarEvent.findById(id);
  if (!event) throw new ApiError(404, msg.notFound("Calendar event"));
  Object.assign(event, body);
  await event.save();
  return event;
}

export async function deleteCalendarEvent(id: string | undefined) {
  if (!id) throw new ApiError(400, msg.invalid("Event", "ID is required."));
  const event = await CalendarEvent.findByIdAndDelete(id);
  if (!event) throw new ApiError(404, msg.notFound("Calendar event"));
  return { deleted: true };
}

export async function listPublicCalendarEvents(year?: string) {
  const query: Record<string, unknown> = { isPublic: true };
  if (year) {
    const y = parseInt(year);
    query.date = { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) };
  }
  return CalendarEvent.find(query).sort({ date: 1 }).select("title titleBn date endDate type description");
}
