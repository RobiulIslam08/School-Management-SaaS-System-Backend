import mongoose, { Schema } from "mongoose";
import { PAYMENT_METHODS } from "./Fee";

export const EXPENSE_CATEGORIES = [
  "utilities",
  "supplies",
  "maintenance",
  "transport",
  "events",
  "food",
  "exam",
  "rent",
  "other",
] as const;

const expenseSchema = new Schema(
  {
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: EXPENSE_CATEGORIES, default: "other" },
    title: { type: String, required: true },
    note: { type: String, default: "" },
    paidVia: { type: String, enum: PAYMENT_METHODS, default: "Cash" },
    paidByName: { type: String, default: "" },
    vendor: { type: String, default: "" },
    refNo: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    createdByName: { type: String, default: "" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "Expenses" }
);

expenseSchema.index({ date: -1, deletedAt: 1 });
expenseSchema.index({ category: 1, date: -1 });

export const Expense = mongoose.model("Expense", expenseSchema);

const donationSchema = new Schema(
  {
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    donorName: { type: String, required: true },
    donorPhone: { type: String, default: "" },
    donorAddress: { type: String, default: "" },
    purpose: { type: String, default: "" },
    method: { type: String, enum: PAYMENT_METHODS, default: "Cash" },
    refNo: { type: String, default: "" },
    receiptNo: { type: String, default: "" },
    note: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    createdByName: { type: String, default: "" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "Donations" }
);

donationSchema.index({ date: -1, deletedAt: 1 });
donationSchema.index({ receiptNo: 1 }, { unique: true, sparse: true });

export const Donation = mongoose.model("Donation", donationSchema);

const staffAttendanceSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["present", "absent", "late", "leave"], required: true },
    remark: { type: String, default: "" },
    markedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "StaffAttendances" }
);

staffAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });
staffAttendanceSchema.index({ date: 1 });

export const StaffAttendance = mongoose.model("StaffAttendance", staffAttendanceSchema);
