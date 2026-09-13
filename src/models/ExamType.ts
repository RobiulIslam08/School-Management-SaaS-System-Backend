import mongoose, { Schema } from "mongoose";

export interface ExamTypeDoc {
  name: string;
  code: string;
  weight: number;
  academicYear: string;
  startDate?: Date;
  endDate?: Date;
  isPublished: boolean;
}

const examSchema = new Schema<ExamTypeDoc>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    weight: { type: Number, default: 0 },
    academicYear: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "ExamTypes" }
);

examSchema.index({ academicYear: 1, code: 1 }, { unique: true });

export const ExamType = mongoose.model<ExamTypeDoc>("ExamType", examSchema);
