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
exports.Hostel = exports.TransportRoute = exports.BookIssue = exports.Book = exports.Payroll = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payrollSchema = new mongoose_1.Schema({
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher", required: true },
    month: { type: String, required: true },
    basic: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    deduction: { type: Number, default: 0 },
    net: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "paid"], default: "draft" },
    paidAt: { type: Date },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, collection: "Payrolls" });
payrollSchema.index({ teacherId: 1, month: 1 }, { unique: true });
exports.Payroll = mongoose_1.default.model("Payroll", payrollSchema);
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: String, default: "" },
    isbn: { type: String, default: "" },
    copies: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
}, { timestamps: true });
exports.Book = mongoose_1.default.model("Book", bookSchema);
const bookIssueSchema = new mongoose_1.Schema({
    bookId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Book", required: true },
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    issuedAt: { type: Date, default: Date.now },
    dueAt: { type: Date, required: true },
    returnedAt: { type: Date },
    status: { type: String, enum: ["issued", "returned"], default: "issued" },
}, { timestamps: true });
exports.BookIssue = mongoose_1.default.model("BookIssue", bookIssueSchema);
const routeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    driverName: { type: String, default: "" },
    driverPhone: { type: String, default: "" },
    vehicleNo: { type: String, default: "" },
    stops: { type: [String], default: [] },
    fee: { type: Number, default: 0 },
}, { timestamps: true });
exports.TransportRoute = mongoose_1.default.model("TransportRoute", routeSchema);
const hostelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["boys", "girls"], required: true },
    capacity: { type: Number, default: 0 },
    occupied: { type: Number, default: 0 },
    warden: { type: String, default: "" },
}, { timestamps: true });
exports.Hostel = mongoose_1.default.model("Hostel", hostelSchema);
