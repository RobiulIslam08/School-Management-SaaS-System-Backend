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
exports.Routine = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const routineSchema = new mongoose_1.Schema({
    classId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ClassStructure", required: true },
    section: { type: String, required: true },
    day: { type: Number, required: true, min: 0, max: 6 },
    period: { type: Number, required: true, min: 1 },
    subjectId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subject" },
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher" },
}, { timestamps: true, collection: "Routines" });
routineSchema.index({ classId: 1, section: 1, day: 1, period: 1 }, { unique: true });
exports.Routine = mongoose_1.default.model("Routine", routineSchema);
