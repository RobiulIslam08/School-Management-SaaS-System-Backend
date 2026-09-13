import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure", required: true },
    section: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["present", "absent", "late", "leave"], required: true },
    remark: { type: String, default: "" },
    markedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ classId: 1, section: 1, date: 1 });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
