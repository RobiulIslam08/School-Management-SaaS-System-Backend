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
exports.Result = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const resultSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    examTypeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ExamType", required: true },
    academicYear: { type: String, required: true },
    subjectMarks: [
        {
            subjectId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subject", required: true },
            cq: { type: Number, default: 0 },
            mcq: { type: Number, default: 0 },
            practical: { type: Number, default: 0 },
            attendance: { type: Number, default: 0 },
            obtained: { type: Number, default: 0 },
            full: { type: Number, default: 0 },
            gpa: { type: Number, default: 0 },
            letter: { type: String, default: "" },
            percent: { type: Number, default: 0 },
        },
    ],
    totalObtained: { type: Number, default: 0 },
    totalFull: { type: Number, default: 0 },
    gpa: { type: Number, default: 0 },
    letter: { type: String, default: "" },
    meritPosition: { type: Number, default: null },
    version: { type: Number, default: 1 },
    history: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
resultSchema.index({ studentId: 1, examTypeId: 1 }, { unique: true });
resultSchema.index({ examTypeId: 1, deletedAt: 1 });
exports.Result = mongoose_1.default.model("Result", resultSchema);
