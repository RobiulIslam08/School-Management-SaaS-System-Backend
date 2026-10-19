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
exports.SmsLog = exports.Notice = exports.NOTICE_CATEGORIES = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.NOTICE_CATEGORIES = ["general", "exam", "holiday", "fee", "admission", "other"];
const signatorySchema = new mongoose_1.Schema({
    name: { type: String, default: "" },
    designation: { type: String, default: "" },
}, { _id: false });
const noticeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    audience: {
        type: String,
        enum: ["all", "teachers", "students", "guardians", "class"],
        default: "all",
    },
    classId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ClassStructure" },
    isPublished: { type: Boolean, default: true },
    refNo: { type: String, default: "" },
    issueDate: { type: Date },
    category: {
        type: String,
        enum: exports.NOTICE_CATEGORIES,
        default: "general",
    },
    signatories: { type: [signatorySchema], default: [] },
    showOnWebsite: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    createdByName: { type: String, default: "" },
}, { timestamps: true });
noticeSchema.index({ isPublished: 1, showOnWebsite: 1, pinned: -1, createdAt: -1 });
noticeSchema.index({ refNo: 1 });
exports.Notice = mongoose_1.default.model("Notice", noticeSchema);
const smsLogSchema = new mongoose_1.Schema({
    to: { type: String, required: true },
    template: { type: String, default: "custom" },
    body: { type: String, required: true },
    status: { type: String, enum: ["queued", "sent", "failed"], default: "queued" },
    audience: { type: String, default: "" },
    error: { type: String, default: "" },
}, { timestamps: true, collection: "SMSLogs" });
exports.SmsLog = mongoose_1.default.model("SmsLog", smsLogSchema);
