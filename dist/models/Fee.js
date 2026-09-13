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
exports.FeeLedger = exports.FeeStructure = exports.PAYMENT_METHODS = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.PAYMENT_METHODS = [
    "Cash",
    "bKash",
    "Nagad",
    "Rocket",
    "Bank Transfer",
    "Cheque",
    "Other",
];
const feeStructureSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    classId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ClassStructure" },
    academicYear: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["monthly", "one_time"], default: "monthly" },
    month: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: "FeeStructures" });
const feeLedgerSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    feeStructureId: { type: mongoose_1.Schema.Types.ObjectId, ref: "FeeStructure" },
    academicYear: { type: String, required: true },
    title: { type: String, required: true },
    dueAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: { type: String, enum: ["due", "partial", "paid"], default: "due" },
    payments: [
        {
            amount: { type: Number, required: true },
            method: { type: String, enum: exports.PAYMENT_METHODS, required: true },
            refNo: { type: String, default: "" },
            date: { type: Date, default: Date.now },
            note: { type: String, default: "" },
        },
    ],
    version: { type: Number, default: 1 },
    history: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, collection: "FeeLedgers" });
feeLedgerSchema.index({ studentId: 1, academicYear: 1 });
exports.FeeStructure = mongoose_1.default.model("FeeStructure", feeStructureSchema);
exports.FeeLedger = mongoose_1.default.model("FeeLedger", feeLedgerSchema);
