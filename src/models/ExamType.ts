import mongoose, { Schema } from "mongoose";

export interface ExamScheduleItem {
  subjectId?: mongoose.Types.ObjectId;
  subjectName?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  venue?: string;
}

export interface ExamTypeDoc {
  name: string;
  code: string;
  weight: number;
  academicYear: string;
  startDate?: Date;
  endDate?: Date;
  isPublished: boolean;
  schedule?: ExamScheduleItem[];
}

const scheduleItemSchema = new Schema(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    subjectName: { type: String, default: "" },
    date: { type: Date },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    venue: { type: String, default: "" },
  },
  { _id: false }
);

const examSchema = new Schema<ExamTypeDoc>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    weight: { type: Number, default: 0 },
    academicYear: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isPublished: { type: Boolean, default: false },
    schedule: { type: [scheduleItemSchema], default: [] },
  },
  { timestamps: true, collection: "ExamTypes" }
);

examSchema.index({ academicYear: 1, code: 1 }, { unique: true });

export const ExamType = mongoose.model<ExamTypeDoc>("ExamType", examSchema);
