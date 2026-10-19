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
exports.DeviceUserMap = exports.TimeAttendanceLog = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const timeAttendanceLogSchema = new mongoose_1.Schema({
    deviceId: { type: String, required: true },
    deviceUserId: { type: String, required: true },
    punchTime: { type: Date, required: true },
    punchType: { type: String, enum: ["in", "out", "unknown"], default: "unknown" },
    rawData: { type: mongoose_1.Schema.Types.Mixed },
    staffId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher" },
    staffName: { type: String },
    date: { type: String }, // YYYY-MM-DD
}, { timestamps: true });
timeAttendanceLogSchema.index({ deviceId: 1, punchTime: -1 });
timeAttendanceLogSchema.index({ date: 1, staffId: 1 });
timeAttendanceLogSchema.index({ deviceId: 1, deviceUserId: 1, date: 1 });
exports.TimeAttendanceLog = mongoose_1.default.model("TimeAttendanceLog", timeAttendanceLogSchema);
const deviceUserMapSchema = new mongoose_1.Schema({
    deviceId: { type: String, required: true },
    deviceUserId: { type: String, required: true },
    staffId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher", required: true },
    staffName: { type: String, required: true },
}, { timestamps: true });
deviceUserMapSchema.index({ deviceId: 1, deviceUserId: 1 }, { unique: true });
exports.DeviceUserMap = mongoose_1.default.model("DeviceUserMap", deviceUserMapSchema);
