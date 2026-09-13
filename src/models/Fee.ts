import mongoose, { Schema } from "mongoose";

export const PAYMENT_METHODS = [
  "Cash",
  "bKash",
  "Nagad",
  "Rocket",
  "Bank Transfer",
  "Cheque",
  "Other",
] as const;

const feeStructureSchema = new Schema(
  {
    name: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "ClassStructure" },
    academicYear: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["monthly", "one_time"], default: "monthly" },
    month: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "FeeStructures" }
);

const feeLedgerSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    feeStructureId: { type: Schema.Types.ObjectId, ref: "FeeStructure" },
    academicYear: { type: String, required: true },
    title: { type: String, required: true },
    dueAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: { type: String, enum: ["due", "partial", "paid"], default: "due" },
    payments: [
      {
        amount: { type: Number, required: true },
        method: { type: String, enum: PAYMENT_METHODS, required: true },
        refNo: { type: String, default: "" },
        date: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
    version: { type: Number, default: 1 },
    history: { type: [Schema.Types.Mixed], default: [] },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "FeeLedgers" }
);

feeLedgerSchema.index({ studentId: 1, academicYear: 1 });

export const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export const FeeLedger = mongoose.model("FeeLedger", feeLedgerSchema);
