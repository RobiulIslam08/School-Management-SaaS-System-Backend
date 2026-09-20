import { z } from "zod";

export const addressSchema = z.object({
  division: z.string().optional(),
  district: z.string().optional(),
  upazila: z.string().optional(),
  area: z.string().optional(),
  holding: z.string().optional(),
  block: z.string().optional(),
  road: z.string().optional(),
  postOffice: z.string().optional(),
});

export const guardianSchema = z.object({
  fatherName: z.string().optional(),
  fatherNameBn: z.string().optional(),
  motherName: z.string().optional(),
  motherNameBn: z.string().optional(),
  guardianName: z.string().optional(),
  guardianNameBn: z.string().optional(),
  relation: z.string().optional(),
  nid: z.string().optional(),
  phone: z.string().optional(),
  fatherPhone: z.string().optional(),
  motherPhone: z.string().optional(),
  email: z.string().optional(),
  occupation: z.string().optional(),
});

export const studentCreateValidation = z.object({
  name: z.string().min(2, "Student name is required"),
  nameBn: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().optional(),
  birthRegNo: z.string().optional(),
  bloodGroup: z.string().optional(),
  religion: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  classId: z.string().optional(),
  section: z.string().optional(),
  group: z.enum(["Science", "Business", "Humanities", "None"]).optional(),
  academicYear: z.string(),
  rollNo: z.string().optional(),
  previousSchool: z.string().optional(),
  healthNotes: z.string().optional(),
  address: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
  guardian: guardianSchema.optional(),
  talentTags: z.array(z.string()).optional(),
  status: z.enum(["pending", "active", "alumni", "transferred"]).optional(),
  photoUrl: z.string().optional(),
});

export const studentUpdateValidation = studentCreateValidation.partial();

export const promoteValidation = z.object({
  ids: z.array(z.string()).min(1, "Select at least one student"),
  targetClassId: z.string(),
  targetSection: z.string(),
});
