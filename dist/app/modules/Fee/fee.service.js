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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerStatus = void 0;
exports.listStructures = listStructures;
exports.createStructure = createStructure;
exports.listLedgers = listLedgers;
exports.createLedger = createLedger;
exports.addPayment = addPayment;
exports.addPayments = addPayments;
exports.feeSummary = feeSummary;
exports.archiveLedger = archiveLedger;
const mongoose_1 = __importDefault(require("mongoose"));
const Fee_1 = require("../../../models/Fee");
const audit_service_1 = require("../../../services/audit.service");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const fee_utils_1 = require("./fee.utils");
Object.defineProperty(exports, "ledgerStatus", { enumerable: true, get: function () { return fee_utils_1.ledgerStatus; } });
async function listStructures(academicYear) {
    return Fee_1.FeeStructure.find(academicYear ? { academicYear } : {}).populate("classId", "name");
}
async function createStructure(body) {
    return Fee_1.FeeStructure.create(body);
}
async function listLedgers(query) {
    const filter = { deletedAt: null };
    if (query.studentId)
        filter.studentId = query.studentId;
    if (query.status)
        filter.status = query.status;
    return Fee_1.FeeLedger.find(filter)
        .populate({
        path: "studentId",
        select: "name studentId classId",
        populate: { path: "classId", select: "name" },
    })
        .sort({ createdAt: -1 });
}
async function createLedger(body) {
    const { Student } = await Promise.resolve().then(() => __importStar(require("../../../models/Student")));
    const student = await Student.findById(body.studentId).select("_id");
    if (!student)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Student"));
    if (body.feeStructureId) {
        const structure = await Fee_1.FeeStructure.findById(body.feeStructureId).select("_id");
        if (!structure)
            throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Fee structure"));
    }
    const title = body.title.trim();
    if (!title)
        throw new ApiError_1.ApiError(400, "Fee title is required");
    if (title.toLowerCase() === "tuition") {
        throw new ApiError_1.ApiError(400, 'Use "Monthly Tuition Fee" for tuition dues.');
    }
    const discount = Math.max(0, body.discount ?? 0);
    return Fee_1.FeeLedger.create({
        ...body,
        title,
        discount,
        paidAmount: 0,
        status: (0, fee_utils_1.ledgerStatus)(body.dueAmount, 0, discount),
    });
}
async function addPayment(ledgerId, payment, user, session) {
    const id = (0, persist_1.requireId)(ledgerId, "Fee ledger");
    const query = Fee_1.FeeLedger.findById(id);
    const ledger = session ? await query.session(session) : await query;
    if (!ledger || ledger.deletedAt)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Fee ledger"));
    const remaining = Math.max(ledger.dueAmount - (ledger.discount ?? 0) - ledger.paidAmount, 0);
    if (payment.amount > remaining) {
        throw new ApiError_1.ApiError(400, `Payment exceeds remaining balance (৳ ${remaining}).`);
    }
    const paymentsSnapshot = ledger.payments.map((p) => typeof p.toObject === "function"
        ? p.toObject()
        : { ...p });
    ledger.history.push({
        version: ledger.version,
        paidAmount: ledger.paidAmount,
        payments: paymentsSnapshot,
        at: new Date(),
    });
    ledger.payments.push({
        amount: payment.amount,
        method: payment.method,
        refNo: payment.refNo ?? "",
        receiptNo: payment.receiptNo ?? "",
        note: payment.note ?? "",
        particular: payment.particular ?? "",
        date: payment.date ? new Date(payment.date) : new Date(),
    });
    ledger.paidAmount += payment.amount;
    ledger.status = (0, fee_utils_1.ledgerStatus)(ledger.dueAmount, ledger.paidAmount, ledger.discount);
    ledger.version += 1;
    await ledger.save(session ? { session } : undefined);
    await (0, audit_service_1.writeAudit)({ user, action: "payment", entity: "FeeLedger", entityId: id, after: payment });
    return ledger;
}
function receiptStamp(date) {
    const paidAt = date ? new Date(date) : new Date();
    const ymd = date && /^\d{4}-\d{2}-\d{2}/.test(date)
        ? date.slice(0, 10).replace(/-/g, "")
        : `${paidAt.getFullYear()}${String(paidAt.getMonth() + 1).padStart(2, "0")}${String(paidAt.getDate()).padStart(2, "0")}`;
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return { receiptNo: `FEE-${ymd}-${suffix}`, iso: paidAt.toISOString() };
}
function classLabel(value) {
    if (value && typeof value === "object" && "name" in value) {
        const name = value.name;
        return typeof name === "string" ? name : "";
    }
    return "";
}
function remainingOf(ledger) {
    return Math.max(ledger.dueAmount - (ledger.discount ?? 0) - ledger.paidAmount, 0);
}
function transactionsUnsupported(error) {
    const message = error instanceof Error ? error.message : String(error);
    return /replica set|Transaction numbers are only allowed/i.test(message);
}
async function planPaymentLine(line, studentId) {
    const printed = (line.title ?? "").trim();
    if (line.ledgerId) {
        const ledger = await Fee_1.FeeLedger.findOne({ _id: line.ledgerId, deletedAt: null });
        if (!ledger)
            throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Fee ledger"));
        const remaining = remainingOf(ledger);
        if (line.amount > remaining) {
            throw new ApiError_1.ApiError(400, `Payment exceeds remaining balance for ${ledger.title} (৳ ${remaining}).`);
        }
        return { ledger, title: printed || ledger.title, amount: line.amount };
    }
    if (!studentId || !printed) {
        throw new ApiError_1.ApiError(400, "Student is required when a fee title has no ledger");
    }
    const open = await Fee_1.FeeLedger.find({
        studentId,
        deletedAt: null,
        status: { $in: ["due", "partial"] },
    });
    const chosen = (0, fee_utils_1.pickFeeLedger)(open, printed, line.amount, remainingOf);
    if (chosen?.kind === "pay")
        return { ledger: chosen.ledger, title: printed, amount: line.amount };
    if (chosen?.kind === "over") {
        const left = remainingOf(chosen.ledger);
        throw new ApiError_1.ApiError(400, `Payment exceeds remaining balance for ${chosen.ledger.title} (৳ ${left}).`);
    }
    const { Student } = await Promise.resolve().then(() => __importStar(require("../../../models/Student")));
    const student = await Student.findById(studentId).select("academicYear");
    if (!student)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Student"));
    return {
        ledger: null,
        createFor: {
            studentId,
            academicYear: student.academicYear || String(new Date().getFullYear()),
            title: printed,
        },
        title: printed,
        amount: line.amount,
    };
}
async function writePlannedPayments(planned, input, user, session) {
    const resolved = [];
    for (const item of planned) {
        let ledger = item.ledger;
        if (!ledger) {
            const doc = {
                studentId: item.createFor.studentId,
                academicYear: item.createFor.academicYear,
                title: item.createFor.title,
                dueAmount: item.amount,
                discount: 0,
                paidAmount: 0,
                status: "due",
            };
            ledger = session ? (await Fee_1.FeeLedger.create([doc], { session }))[0] : await Fee_1.FeeLedger.create(doc);
        }
        resolved.push({ ledger, title: item.title, amount: item.amount });
    }
    const stamp = receiptStamp(input.date);
    for (const item of resolved) {
        await addPayment(String(item.ledger._id), {
            amount: item.amount,
            method: input.method,
            refNo: input.refNo,
            note: input.note,
            date: input.date,
            receiptNo: stamp.receiptNo,
            particular: item.title,
        }, user, session);
    }
    return { resolved, stamp };
}
async function addPayments(input, user) {
    const lines = input.lines ?? [];
    if (!lines.length)
        throw new ApiError_1.ApiError(400, "At least one fee line is required");
    const planned = [];
    for (const line of lines) {
        planned.push(await planPaymentLine(line, input.studentId));
    }
    const knownIds = planned.flatMap((item) => (item.ledger ? [String(item.ledger._id)] : []));
    if (new Set(knownIds).size !== knownIds.length) {
        throw new ApiError_1.ApiError(400, "Each fee head can be paid only once in a receipt");
    }
    const studentIds = new Set();
    if (input.studentId)
        studentIds.add(input.studentId);
    for (const item of planned) {
        if (item.ledger)
            studentIds.add(String(item.ledger.studentId));
    }
    if (studentIds.size !== 1) {
        throw new ApiError_1.ApiError(400, "All fee lines must belong to the same student");
    }
    const session = await mongoose_1.default.startSession();
    let written;
    try {
        try {
            await session.withTransaction(async () => {
                written = await writePlannedPayments(planned, input, user, session);
            });
        }
        catch (error) {
            if (!transactionsUnsupported(error))
                throw error;
            written = await writePlannedPayments(planned, input, user, null);
        }
    }
    finally {
        await session.endSession();
    }
    const { resolved, stamp } = written;
    const { Student } = await Promise.resolve().then(() => __importStar(require("../../../models/Student")));
    const student = await Student.findById([...studentIds][0])
        .select("name studentId classId")
        .populate("classId", "name");
    const years = [...new Set(resolved.map((item) => item.ledger.academicYear).filter(Boolean))];
    return {
        receiptNo: stamp.receiptNo,
        method: input.method,
        refNo: input.refNo ?? "",
        date: stamp.iso,
        academicYear: years.join(", "),
        student: {
            name: student?.name ?? "",
            studentId: student?.studentId ?? "",
            className: classLabel(student?.classId),
        },
        lines: resolved.map((item) => ({
            ledgerId: String(item.ledger._id),
            title: item.title,
            amount: item.amount,
        })),
    };
}
async function feeSummary() {
    const ledgers = await Fee_1.FeeLedger.find({ deletedAt: null }).populate({
        path: "studentId",
        select: "classId",
        populate: { path: "classId", select: "name" },
    });
    const due = ledgers.reduce((sum, item) => sum + Math.max(item.dueAmount - item.discount - item.paidAmount, 0), 0);
    const collected = ledgers.reduce((sum, item) => sum + item.paidAmount, 0);
    const byMethod = {};
    ledgers.forEach((ledger) => {
        ledger.payments.forEach((payment) => {
            byMethod[payment.method] = (byMethod[payment.method] ?? 0) + payment.amount;
        });
    });
    return { due, collected, byMethod, count: ledgers.length, byClass: (0, fee_utils_1.aggregateFeesByClass)(ledgers) };
}
async function archiveLedger(id) {
    const recordId = (0, persist_1.requireId)(id, "Fee ledger");
    const ledger = await Fee_1.FeeLedger.findById(recordId);
    if (!ledger)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Fee ledger"));
    if (ledger.deletedAt) {
        throw new ApiError_1.ApiError(400, messages_1.msg.updateBlocked("Fee ledger", "It is already archived."));
    }
    ledger.deletedAt = new Date();
    await ledger.save();
    return { id: ledger._id };
}
