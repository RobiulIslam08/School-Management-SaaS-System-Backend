import mongoose, { Schema } from "mongoose";

export interface TeacherDoc {
  staffId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  subjects: mongoose.Types.ObjectId[];
  classTeacherOf?: { classId: mongoose.Types.ObjectId; section: string };
  photoUrl?: string;
  salaryStructure: {
    basic: number;
    house: number;
    medical: number;
    other: number;
  };
  joiningDate?: Date;
  retirementDate?: Date;
  isActive: boolean;
}

const teacherSchema = new Schema<TeacherDoc>(
  {
    staffId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", lowercase: true },
    phone: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    designation: { type: String, default: "Teacher" },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    classTeacherOf: {
      classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
      section: { type: String },
    },
    salaryStructure: {
      basic: { type: Number, default: 0 },
      house: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    joiningDate: { type: Date },
    retirementDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teacherSchema.index({ name: 1 });
teacherSchema.index({ phone: 1 });

export const Teacher = mongoose.model<TeacherDoc>("Teacher", teacherSchema);
