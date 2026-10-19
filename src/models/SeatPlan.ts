import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema(
  {
    seatNo: { type: String, required: true },
    row: { type: Number },
    col: { type: Number },
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
    studentName: { type: String, default: "" },
    studentSysId: { type: String, default: "" }, // student.studentId
    rollNo: { type: String, default: "" },
  },
  { _id: false }
);

const hallSchema = new Schema(
  {
    name: { type: String, required: true },
    rows: { type: Number, default: 5 },
    cols: { type: Number, default: 6 },
    seats: [seatSchema],
  },
  { _id: true }
);

export interface SeatPlanDoc {
  examId: mongoose.Types.ObjectId;
  classId?: mongoose.Types.ObjectId;
  section?: string;
  halls: Array<{
    name: string;
    rows: number;
    cols: number;
    seats: Array<{
      seatNo: string;
      row?: number;
      col?: number;
      studentId?: mongoose.Types.ObjectId;
      studentName?: string;
      studentSysId?: string;
      rollNo?: string;
    }>;
  }>;
}

const seatPlanSchema = new Schema<SeatPlanDoc>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "ExamType", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    section: { type: String },
    halls: [hallSchema],
  },
  { timestamps: true }
);

seatPlanSchema.index({ examId: 1, classId: 1, section: 1 }, { unique: true });

export const SeatPlan = mongoose.model<SeatPlanDoc>("SeatPlan", seatPlanSchema);
