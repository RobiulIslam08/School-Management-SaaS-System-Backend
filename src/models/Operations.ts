import mongoose, { Schema } from "mongoose";

const payrollSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    month: { type: String, required: true },
    basic: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    deduction: { type: Number, default: 0 },
    net: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "paid"], default: "draft" },
    paidAt: { type: Date },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "Payrolls" }
);

payrollSchema.index({ teacherId: 1, month: 1 }, { unique: true });

export const Payroll = mongoose.model("Payroll", payrollSchema);

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, default: "" },
    isbn: { type: String, default: "" },
    copies: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);

const bookIssueSchema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    issuedAt: { type: Date, default: Date.now },
    dueAt: { type: Date, required: true },
    returnedAt: { type: Date },
    status: { type: String, enum: ["issued", "returned"], default: "issued" },
  },
  { timestamps: true }
);

export const BookIssue = mongoose.model("BookIssue", bookIssueSchema);

const routeSchema = new Schema(
  {
    name: { type: String, required: true },
    driverName: { type: String, default: "" },
    driverPhone: { type: String, default: "" },
    vehicleNo: { type: String, default: "" },
    stops: { type: [String], default: [] },
    fee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TransportRoute = mongoose.model("TransportRoute", routeSchema);

const hostelSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["boys", "girls"], required: true },
    capacity: { type: Number, default: 0 },
    occupied: { type: Number, default: 0 },
    warden: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Hostel = mongoose.model("Hostel", hostelSchema);
