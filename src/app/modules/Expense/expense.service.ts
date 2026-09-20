import { Expense, EXPENSE_CATEGORIES } from "../../../models/Accounts";
import { SchoolSettings } from "../../../models/SchoolSettings";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId } from "../../../utils/persist";

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

export async function listExpenses(query: {
  year?: string;
  month?: string;
  category?: string;
  q?: string;
  from?: string;
  to?: string;
}) {
  const filter: Record<string, unknown> = { deletedAt: null };
  if (query.category) filter.category = query.category;
  if (query.from || query.to || query.year) {
    const range: { $gte?: Date; $lt?: Date } = {};
    if (query.from) range.$gte = new Date(`${query.from}T00:00:00.000Z`);
    if (query.to) {
      const end = new Date(`${query.to}T00:00:00.000Z`);
      end.setUTCDate(end.getUTCDate() + 1);
      range.$lt = end;
    }
    if (query.year && !query.from && !query.to) {
      const { start, end } = monthRange(query.year, query.month);
      range.$gte = start;
      range.$lt = end;
    }
    filter.date = range;
  }
  if (query.q?.trim()) {
    const q = query.q.trim();
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { vendor: { $regex: q, $options: "i" } },
      { paidByName: { $regex: q, $options: "i" } },
      { refNo: { $regex: q, $options: "i" } },
    ];
  }
  return Expense.find(filter).sort({ date: -1, createdAt: -1 });
}

export async function expenseSummary(query: { year?: string; month?: string }) {
  const year = query.year || String(new Date().getFullYear());
  const { start, end } = monthRange(year, query.month);
  const items = await Expense.find({ deletedAt: null, date: { $gte: start, $lt: end } });
  const byCategory: Record<string, number> = {};
  for (const key of EXPENSE_CATEGORIES) byCategory[key] = 0;
  let total = 0;
  for (const item of items) {
    total += item.amount;
    byCategory[item.category] = (byCategory[item.category] ?? 0) + item.amount;
  }
  return { total, count: items.length, byCategory, year, month: query.month ?? "" };
}

export async function createExpense(
  body: {
    date: string;
    amount: number;
    category?: string;
    title: string;
    note?: string;
    paidVia?: string;
    paidByName?: string;
    vendor?: string;
    refNo?: string;
    academicYear?: string;
  },
  user?: AuthUser
) {
  const settings = await SchoolSettings.findOne().select("academicYear");
  return Expense.create({
    date: new Date(body.date),
    amount: body.amount,
    category: (body.category ?? "other") as (typeof EXPENSE_CATEGORIES)[number],
    title: body.title,
    note: body.note ?? "",
    paidVia: (body.paidVia ?? "Cash") as "Cash" | "bKash" | "Nagad" | "Rocket" | "Bank Transfer" | "Cheque" | "Other",
    paidByName: body.paidByName ?? "",
    vendor: body.vendor ?? "",
    refNo: body.refNo ?? "",
    academicYear: body.academicYear || settings?.academicYear || "",
    createdByName: user?.name ?? "",
  });
}

export async function updateExpense(id: string | undefined, body: Record<string, unknown>) {
  const recordId = requireId(id, "Expense");
  const item = await Expense.findOne({ _id: recordId, deletedAt: null });
  if (!item) throw new ApiError(404, msg.notFound("Expense"));
  if (body.date !== undefined) item.date = new Date(String(body.date));
  if (body.amount !== undefined) item.amount = Number(body.amount);
  if (body.category !== undefined) item.category = String(body.category) as typeof item.category;
  if (body.title !== undefined) item.title = String(body.title);
  if (body.note !== undefined) item.note = String(body.note);
  if (body.paidVia !== undefined) item.paidVia = String(body.paidVia) as typeof item.paidVia;
  if (body.paidByName !== undefined) item.paidByName = String(body.paidByName);
  if (body.vendor !== undefined) item.vendor = String(body.vendor);
  if (body.refNo !== undefined) item.refNo = String(body.refNo);
  if (body.academicYear !== undefined) item.academicYear = String(body.academicYear);
  if (!item.isModified()) throw new ApiError(400, msg.noChanges("Expense"));
  await item.save();
  return item;
}

export async function deleteExpense(id: string | undefined) {
  const recordId = requireId(id, "Expense");
  const item = await Expense.findOne({ _id: recordId, deletedAt: null });
  if (!item) throw new ApiError(404, msg.notFound("Expense"));
  item.deletedAt = new Date();
  await item.save();
  return { deleted: true };
}
