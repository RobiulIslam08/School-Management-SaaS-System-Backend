import mongoose, { Schema } from "mongoose";

export interface SyllabusDoc {
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  academicYear: string;
  chaptersBn: string[];
  chaptersEn: string[];
}

const syllabusSchema = new Schema<SyllabusDoc>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    academicYear: { type: String, default: "" },
    chaptersBn: { type: [String], default: [] },
    chaptersEn: { type: [String], default: [] },
  },
  { timestamps: true, collection: "SyllabusOutlines" }
);

syllabusSchema.index({ classId: 1, subjectId: 1, academicYear: 1 }, { unique: true });

export const SyllabusOutline = mongoose.model<SyllabusDoc>("SyllabusOutline", syllabusSchema);
