import mongoose, { Schema } from "mongoose";

export interface AdmissionExamResultDoc {
  examId: mongoose.Types.ObjectId;
  roll: string;
  applicantName: string;
  applicantNameBn?: string;
  phone?: string;
  marks: number;
  status: "pass" | "fail" | "pending";
  notes?: string;
}

const admissionExamResultSchema = new Schema<AdmissionExamResultDoc>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "AdmissionExam", required: true },
    roll: { type: String, required: true, trim: true },
    applicantName: { type: String, required: true, trim: true },
    applicantNameBn: { type: String, default: "" },
    phone: { type: String, default: "" },
    marks: { type: Number, default: 0 },
    status: { type: String, enum: ["pass", "fail", "pending"], default: "pending" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

admissionExamResultSchema.index({ examId: 1, roll: 1 }, { unique: true });
admissionExamResultSchema.index({ examId: 1, status: 1 });

export const AdmissionExamResult = mongoose.model<AdmissionExamResultDoc>(
  "AdmissionExamResult",
  admissionExamResultSchema
);
