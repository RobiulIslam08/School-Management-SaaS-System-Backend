import mongoose, { Schema } from "mongoose";
import type { GradeScale, TieBreakField } from "../lib/grading";

export interface GradingRuleDoc {
  name: string;
  academicYear: string;
  classId?: mongoose.Types.ObjectId;
  scale: GradeScale;
  weights: Array<{ examTypeId: mongoose.Types.ObjectId; weight: number }>;
  tieBreak: TieBreakField[];
  isDefault: boolean;
}

const gradingSchema = new Schema<GradingRuleDoc>(
  {
    name: { type: String, required: true },
    academicYear: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    scale: { type: String, enum: ["gpa5", "letter", "percentage"], default: "gpa5" },
    weights: [
      {
        examTypeId: { type: Schema.Types.ObjectId, ref: "ExamType", required: true },
        weight: { type: Number, required: true },
      },
    ],
    tieBreak: { type: [String], default: ["totalMarks", "gpa", "cq"] },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "GradingRules" }
);

export const GradingRule = mongoose.model<GradingRuleDoc>("GradingRule", gradingSchema);
