"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDonations = listDonations;
exports.donationSummary = donationSummary;
exports.createDonation = createDonation;
exports.updateDonation = updateDonation;
exports.deleteDonation = deleteDonation;
const Accounts_1 = require("../../../models/Accounts");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
async function nextReceiptNo() {
    const year = String(new Date().getFullYear());
    const latest = await Accounts_1.Donation.findOne({ receiptNo: new RegExp(`^DON-${year}-`) })
        .sort({ receiptNo: -1 })
        .select("receiptNo")
        .lean();
    const last = latest?.receiptNo?.match(/DON-\d{4}-(\d+)$/)?.[1];
    const next = (last ? Number(last) : 0) + 1;
    return `DON-${year}-${String(next).padStart(4, "0")}`;
}
function monthRange(year, month) {
    if (month && /^\d{2}$/.test(month)) {
        const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
        const end = new Date(start);
        end.setUTCMonth(end.getUTCMonth() + 1);
        return { start, end };
    }
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
    return { start, end };
}
async function listDonations(query) {
    const filter = { deletedAt: null };
    if (query.year) {
        const { start, end } = monthRange(query.year, query.month);
        filter.date = { $gte: start, $lt: end };
    }
    if (query.q?.trim()) {
        const q = query.q.trim();
        filter.$or = [
            { donorName: { $regex: q, $options: "i" } },
            { purpose: { $regex: q, $options: "i" } },
            { receiptNo: { $regex: q, $options: "i" } },
            { refNo: { $regex: q, $options: "i" } },
        ];
    }
    return Accounts_1.Donation.find(filter).sort({ date: -1, createdAt: -1 });
}
async function donationSummary(query) {
    const year = query.year || String(new Date().getFullYear());
    const { start, end } = monthRange(year, query.month);
    const items = await Accounts_1.Donation.find({ deletedAt: null, date: { $gte: start, $lt: end } });
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    return { total, count: items.length, year, month: query.month ?? "" };
}
async function createDonation(body, user) {
    const settings = await SchoolSettings_1.SchoolSettings.findOne().select("academicYear");
    const payload = {
        date: new Date(body.date),
        amount: body.amount,
        donorName: body.donorName,
        donorPhone: body.donorPhone ?? "",
        donorAddress: body.donorAddress ?? "",
        purpose: body.purpose ?? "",
        method: (body.method ?? "Cash"),
        refNo: body.refNo ?? "",
        note: body.note ?? "",
        academicYear: body.academicYear || settings?.academicYear || "",
        createdByName: user?.name ?? "",
    };
    let lastError;
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            return await Accounts_1.Donation.create({
                ...payload,
                receiptNo: await nextReceiptNo(),
            });
        }
        catch (error) {
            lastError = error;
            const code = error?.code;
            if (code !== 11000)
                throw error;
        }
    }
    throw lastError instanceof Error
        ? lastError
        : new ApiError_1.ApiError(500, "Could not create donation receipt. Please try again.");
}
async function updateDonation(id, body) {
    const recordId = (0, persist_1.requireId)(id, "Donation");
    const item = await Accounts_1.Donation.findOne({ _id: recordId, deletedAt: null });
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Donation"));
    if (body.date !== undefined)
        item.date = new Date(String(body.date));
    if (body.amount !== undefined)
        item.amount = Number(body.amount);
    if (body.donorName !== undefined)
        item.donorName = String(body.donorName);
    if (body.donorPhone !== undefined)
        item.donorPhone = String(body.donorPhone);
    if (body.donorAddress !== undefined)
        item.donorAddress = String(body.donorAddress);
    if (body.purpose !== undefined)
        item.purpose = String(body.purpose);
    if (body.method !== undefined)
        item.method = String(body.method);
    if (body.refNo !== undefined)
        item.refNo = String(body.refNo);
    if (body.note !== undefined)
        item.note = String(body.note);
    if (body.academicYear !== undefined)
        item.academicYear = String(body.academicYear);
    if (!item.isModified())
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Donation"));
    await item.save();
    return item;
}
async function deleteDonation(id) {
    const recordId = (0, persist_1.requireId)(id, "Donation");
    const item = await Accounts_1.Donation.findOne({ _id: recordId, deletedAt: null });
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Donation"));
    item.deletedAt = new Date();
    await item.save();
    return { deleted: true };
}
