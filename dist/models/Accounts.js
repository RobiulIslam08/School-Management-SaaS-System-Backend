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
exports.StaffAttendance = exports.Donation = exports.Expense = exports.EXPENSE_CATEGORIES = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Fee_1 = require("./Fee");
exports.EXPENSE_CATEGORIES = [
    "utilities",
    "supplies",
    "maintenance",
    "transport",
    "events",
    "food",
    "exam",
    "rent",
    "other",
];
const expenseSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: exports.EXPENSE_CATEGORIES, default: "other" },
    title: { type: String, required: true },
    note: { type: String, default: "" },
    paidVia: { type: String, enum: Fee_1.PAYMENT_METHODS, default: "Cash" },
    paidByName: { type: String, default: "" },
    vendor: { type: String, default: "" },
    refNo: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    createdByName: { type: String, default: "" },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, collection: "Expenses" });
expenseSchema.index({ date: -1, deletedAt: 1 });
expenseSchema.index({ category: 1, date: -1 });
exports.Expense = mongoose_1.default.model("Expense", expenseSchema);
const donationSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    donorName: { type: String, required: true },
    donorPhone: { type: String, default: "" },
    donorAddress: { type: String, default: "" },
    purpose: { type: String, default: "" },
    method: { type: String, enum: Fee_1.PAYMENT_METHODS, default: "Cash" },
    refNo: { type: String, default: "" },
    receiptNo: { type: String, default: "" },
    note: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    createdByName: { type: String, default: "" },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, collection: "Donations" });
donationSchema.index({ date: -1, deletedAt: 1 });
donationSchema.index({ receiptNo: 1 }, { unique: true, sparse: true });
exports.Donation = mongoose_1.default.model("Donation", donationSchema);
const staffAttendanceSchema = new mongoose_1.Schema({
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["present", "absent", "late", "leave"], required: true },
    remark: { type: String, default: "" },
    markedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true, collection: "StaffAttendances" });
staffAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });
staffAttendanceSchema.index({ date: 1 });
exports.StaffAttendance = mongoose_1.default.model("StaffAttendance", staffAttendanceSchema);
