import mongoose, { Schema } from "mongoose";

export interface AdmissionExamDoc {
  name: string;
  academicYear: string;
  classId?: mongoose.Types.ObjectId;
  className?: string;
  date?: Date;
  totalMark: number;
  passMark: number;
  venue?: string;
  isPublished: boolean;
  description?: string;
}

const admissionExamSchema = new Schema<AdmissionExamDoc>(
  {
    name: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    className: { type: String, default: "" },
    date: { type: Date },
    totalMark: { type: Number, default: 100 },
    passMark: { type: Number, default: 40 },
    venue: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

admissionExamSchema.index({ academicYear: 1 });

export const AdmissionExam = mongoose.model<AdmissionExamDoc>("AdmissionExam", admissionExamSchema);
