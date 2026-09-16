import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    division: { type: String, default: "" },
    district: { type: String, default: "" },
    upazila: { type: String, default: "" },
    area: { type: String, default: "" },
    holding: { type: String, default: "" },
    block: { type: String, default: "" },
    road: { type: String, default: "" },
  },
  { _id: false }
);

export interface StudentDoc {
  studentId: string;
  rollNo: string;
  name: string;
  nameBn: string;
  photoUrl: string;
  gender: "male" | "female" | "other";
  dob?: Date;
  bloodGroup: string;
  religion: string;
  phone: string;
  email: string;
  classId?: mongoose.Types.ObjectId;
  section: string;
  group: "Science" | "Business" | "Humanities" | "None";
  academicYear: string;
  status: "pending" | "active" | "alumni" | "transferred";
  previousSchool: string;
  healthNotes: string;
  address: {
    division: string;
    district: string;
    upazila: string;
    area: string;
    holding: string;
    block: string;
    road: string;
  };
  guardian: {
    fatherName: string;
    motherName: string;
    guardianName: string;
    relation: string;
    nid: string;
    phone: string;
    email: string;
    occupation: string;
  };
  talentTags: string[];
  documents: Array<{ label: string; url: string }>;
}

const studentSchema = new Schema<StudentDoc>(
  {
    studentId: { type: String, required: true, unique: true },
    rollNo: { type: String, default: "" },
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: { type: Date },
    bloodGroup: { type: String, default: "" },
    religion: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    section: { type: String, default: "A" },
    group: { type: String, enum: ["Science", "Business", "Humanities", "None"], default: "None" },
    academicYear: { type: String, required: true },
    status: { type: String, enum: ["pending", "active", "alumni", "transferred"], default: "pending" },
    previousSchool: { type: String, default: "" },
    healthNotes: { type: String, default: "" },
    address: { type: addressSchema, default: () => ({}) },
    guardian: {
      fatherName: { type: String, default: "" },
      motherName: { type: String, default: "" },
      guardianName: { type: String, default: "" },
      relation: { type: String, default: "Father" },
      nid: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      occupation: { type: String, default: "" },
    },
    talentTags: { type: [String], default: [] },
    documents: { type: [{ label: String, url: String }], default: [] },
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", nameBn: "text", studentId: "text", phone: "text" });
studentSchema.index({ classId: 1, section: 1, academicYear: 1 });
studentSchema.index({ "address.district": 1, "address.upazila": 1, "address.area": 1 });
studentSchema.index({ talentTags: 1 });

export const Student = mongoose.model<StudentDoc>("Student", studentSchema);
