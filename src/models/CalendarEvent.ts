import mongoose, { Schema } from "mongoose";

export type CalendarEventType = "holiday" | "exam" | "event" | "meeting" | "other";

export interface CalendarEventDoc {
  title: string;
  titleBn?: string;
  date: Date;
  endDate?: Date;
  type: CalendarEventType;
  description?: string;
  isPublic: boolean;
  academicYear?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const calendarEventSchema = new Schema<CalendarEventDoc>(
  {
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, default: "" },
    date: { type: Date, required: true },
    endDate: { type: Date },
    type: {
      type: String,
      enum: ["holiday", "exam", "event", "meeting", "other"],
      default: "event",
    },
    description: { type: String, default: "" },
    isPublic: { type: Boolean, default: true },
    academicYear: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

calendarEventSchema.index({ date: 1 });
calendarEventSchema.index({ academicYear: 1, type: 1 });

export const CalendarEvent = mongoose.model<CalendarEventDoc>("CalendarEvent", calendarEventSchema);
