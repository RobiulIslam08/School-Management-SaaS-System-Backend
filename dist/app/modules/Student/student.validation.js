"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoteValidation = exports.studentUpdateValidation = exports.studentCreateValidation = exports.guardianSchema = exports.addressSchema = void 0;
const zod_1 = require("zod");
exports.addressSchema = zod_1.z.object({
    division: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    upazila: zod_1.z.string().optional(),
    area: zod_1.z.string().optional(),
});
exports.guardianSchema = zod_1.z.object({
    fatherName: zod_1.z.string().optional(),
    motherName: zod_1.z.string().optional(),
    guardianName: zod_1.z.string().optional(),
    relation: zod_1.z.string().optional(),
    nid: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
});
exports.studentCreateValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, "Student name is required"),
    nameBn: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["male", "female", "other"]),
    dob: zod_1.z.string().optional(),
    bloodGroup: zod_1.z.string().optional(),
    religion: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    classId: zod_1.z.string().optional(),
    section: zod_1.z.string().optional(),
    group: zod_1.z.enum(["Science", "Business", "Humanities", "None"]).optional(),
    academicYear: zod_1.z.string(),
    rollNo: zod_1.z.string().optional(),
    previousSchool: zod_1.z.string().optional(),
    healthNotes: zod_1.z.string().optional(),
    address: exports.addressSchema.optional(),
    guardian: exports.guardianSchema.optional(),
    talentTags: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(["pending", "active", "alumni", "transferred"]).optional(),
    photoUrl: zod_1.z.string().optional(),
});
exports.studentUpdateValidation = exports.studentCreateValidation.partial();
exports.promoteValidation = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string()).min(1, "Select at least one student"),
    targetClassId: zod_1.z.string(),
    targetSection: zod_1.z.string(),
});
