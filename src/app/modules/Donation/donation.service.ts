import { Donation } from "../../../models/Accounts";
import { SchoolSettings } from "../../../models/SchoolSettings";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId } from "../../../utils/persist";

async function nextReceiptNo(): Promise<string> {
  const year = String(new Date().getFullYear());
  const latest = await Donation.findOne({ receiptNo: new RegExp(`^DON-${year}-`) })
    .sort({ receiptNo: -1 })
    .select("receiptNo")
    .lean();
  const last = latest?.receiptNo?.match(/DON-\d{4}-(\d+)$/)?.[1];
  const next = (last ? Number(last) : 0) + 1;
  return `DON-${year}-${String(next).padStart(4, "0")}`;
}

function monthRange(year: string, month?: string) {
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

export async function listDonations(query: {
  year?: string;
  month?: string;
  q?: string;
}) {
  const filter: Record<string, unknown> = { deletedAt: null };
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
  return Donation.find(filter).sort({ date: -1, createdAt: -1 });
}

export async function donationSummary(query: { year?: string; month?: string }) {
  const year = query.year || String(new Date().getFullYear());
  const { start, end } = monthRange(year, query.month);
  const items = await Donation.find({ deletedAt: null, date: { $gte: start, $lt: end } });
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return { total, count: items.length, year, month: query.month ?? "" };
}

export async function createDonation(
  body: {
    date: string;
    amount: number;
    donorName: string;
    donorPhone?: string;
    donorAddress?: string;
    purpose?: string;
    method?: string;
    refNo?: string;
    note?: string;
    academicYear?: string;
  },
  user?: AuthUser
) {
  const settings = await SchoolSettings.findOne().select("academicYear");
  const payload = {
    date: new Date(body.date),
    amount: body.amount,
    donorName: body.donorName,
    donorPhone: body.donorPhone ?? "",
    donorAddress: body.donorAddress ?? "",
    purpose: body.purpose ?? "",
    method: (body.method ?? "Cash") as "Cash" | "bKash" | "Nagad" | "Rocket" | "Bank Transfer" | "Cheque" | "Other",
    refNo: body.refNo ?? "",
    note: body.note ?? "",
    academicYear: body.academicYear || settings?.academicYear || "",
    createdByName: user?.name ?? "",
  };

  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await Donation.create({
        ...payload,
        receiptNo: await nextReceiptNo(),
      });
    } catch (error) {
      lastError = error;
      const code = (error as { code?: number })?.code;
      if (code !== 11000) throw error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new ApiError(500, "Could not create donation receipt. Please try again.");
}

export async function updateDonation(id: string | undefined, body: Record<string, unknown>) {
  const recordId = requireId(id, "Donation");
  const item = await Donation.findOne({ _id: recordId, deletedAt: null });
  if (!item) throw new ApiError(404, msg.notFound("Donation"));
  if (body.date !== undefined) item.date = new Date(String(body.date));
  if (body.amount !== undefined) item.amount = Number(body.amount);
  if (body.donorName !== undefined) item.donorName = String(body.donorName);
  if (body.donorPhone !== undefined) item.donorPhone = String(body.donorPhone);
  if (body.donorAddress !== undefined) item.donorAddress = String(body.donorAddress);
  if (body.purpose !== undefined) item.purpose = String(body.purpose);
  if (body.method !== undefined) item.method = String(body.method) as typeof item.method;
  if (body.refNo !== undefined) item.refNo = String(body.refNo);
  if (body.note !== undefined) item.note = String(body.note);
  if (body.academicYear !== undefined) item.academicYear = String(body.academicYear);
  if (!item.isModified()) throw new ApiError(400, msg.noChanges("Donation"));
  await item.save();
  return item;
}

export async function deleteDonation(id: string | undefined) {
  const recordId = requireId(id, "Donation");
  const item = await Donation.findOne({ _id: recordId, deletedAt: null });
  if (!item) throw new ApiError(404, msg.notFound("Donation"));
  item.deletedAt = new Date();
  await item.save();
  return { deleted: true };
}
