import mongoose, { Schema } from "mongoose";

export interface RoutineDoc {
  classId: mongoose.Types.ObjectId;
  section: string;
  day: number;
  period: number;
  subjectId?: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId;
}

const routineSchema = new Schema<RoutineDoc>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure", required: true },
    section: { type: String, required: true },
    day: { type: Number, required: true, min: 0, max: 6 },
    period: { type: Number, required: true, min: 1 },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true, collection: "Routines" }
);

routineSchema.index({ classId: 1, section: 1, day: 1, period: 1 }, { unique: true });

export const Routine = mongoose.model<RoutineDoc>("Routine", routineSchema);
