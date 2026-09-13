import mongoose, { Schema } from "mongoose";

export interface SubjectDoc {
  name: string;
  code: string;
  classId: mongoose.Types.ObjectId;
  group: "Science" | "Business" | "Humanities" | "Common";
  markDistribution: {
    cq: number;
    mcq: number;
    practical: number;
    attendance: number;
  };
  sortOrder: number;
  compulsory: boolean;
  teacherId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const subjectSchema = new Schema<SubjectDoc>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure", required: true },
    group: { type: String, enum: ["Science", "Business", "Humanities", "Common"], default: "Common" },
    markDistribution: {
      cq: { type: Number, default: 60 },
      mcq: { type: Number, default: 40 },
      practical: { type: Number, default: 0 },
      attendance: { type: Number, default: 0 },
    },
    sortOrder: { type: Number, default: 0 },
    compulsory: { type: Boolean, default: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subjectSchema.index({ classId: 1, code: 1 }, { unique: true });

export const Subject = mongoose.model<SubjectDoc>("Subject", subjectSchema);
