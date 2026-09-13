"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const addressSchema = new mongoose_1.Schema({
    division: { type: String, default: "" },
    district: { type: String, default: "" },
    upazila: { type: String, default: "" },
    area: { type: String, default: "" },
}, { _id: false });
const studentSchema = new mongoose_1.Schema({
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
    classId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ClassStructure" },
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
}, { timestamps: true });
studentSchema.index({ name: "text", nameBn: "text", studentId: "text", phone: "text" });
studentSchema.index({ classId: 1, section: 1, academicYear: 1 });
studentSchema.index({ "address.district": 1, "address.upazila": 1, "address.area": 1 });
studentSchema.index({ talentTags: 1 });
exports.Student = mongoose_1.default.model("Student", studentSchema);
