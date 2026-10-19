import mongoose, { Schema } from "mongoose";

export type MaterialFileType = "pdf" | "excel" | "word" | "image" | "video" | "other";

export interface LectureMaterialDoc {
  title: string;
  description?: string;
  teacherId?: mongoose.Types.ObjectId;
  teacherName?: string;
  classId?: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileType: MaterialFileType;
  fileSizeBytes?: number;
  isVisible: boolean;
  academicYear?: string;
}

const lectureMaterialSchema = new Schema<LectureMaterialDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
    teacherName: { type: String, default: "" },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["pdf", "excel", "word", "image", "video", "other"],
      default: "pdf",
    },
    fileSizeBytes: { type: Number },
    isVisible: { type: Boolean, default: true },
    academicYear: { type: String },
  },
  { timestamps: true }
);

lectureMaterialSchema.index({ classId: 1, subjectId: 1 });
lectureMaterialSchema.index({ teacherId: 1 });
lectureMaterialSchema.index({ isVisible: 1 });

export const LectureMaterial = mongoose.model<LectureMaterialDoc>("LectureMaterial", lectureMaterialSchema);
