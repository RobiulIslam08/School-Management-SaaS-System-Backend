import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    examTypeId: { type: Schema.Types.ObjectId, ref: "ExamType", required: true },
    academicYear: { type: String, required: true },
    subjectMarks: [
      {
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        cq: { type: Number, default: 0 },
        mcq: { type: Number, default: 0 },
        practical: { type: Number, default: 0 },
        attendance: { type: Number, default: 0 },
        obtained: { type: Number, default: 0 },
        full: { type: Number, default: 0 },
        gpa: { type: Number, default: 0 },
        letter: { type: String, default: "" },
        percent: { type: Number, default: 0 },
      },
    ],
    totalObtained: { type: Number, default: 0 },
    totalFull: { type: Number, default: 0 },
    gpa: { type: Number, default: 0 },
    letter: { type: String, default: "" },
    meritPosition: { type: Number, default: null },
    version: { type: Number, default: 1 },
    history: { type: [Schema.Types.Mixed], default: [] },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, examTypeId: 1 }, { unique: true });
resultSchema.index({ examTypeId: 1, deletedAt: 1 });

export const Result = mongoose.model("Result", resultSchema);
