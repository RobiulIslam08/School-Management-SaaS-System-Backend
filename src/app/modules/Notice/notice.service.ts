import { Notice } from "../../../models/Notice";
import { SchoolSettings } from "../../../models/SchoolSettings";
import type { AuthUser } from "../../../types/express";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { deleteDocument, requireId, updateDocument } from "../../../utils/persist";
import type { NoticeCreateBody } from "./notice.interface";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function nextRefNo(): Promise<string> {
  const settings = await SchoolSettings.findOne().select("academicYear");
  const year = settings?.academicYear ?? String(new Date().getFullYear());
  const prefix = `NOT-${escapeRegExp(year)}-`;
  const count = await Notice.countDocuments({ refNo: new RegExp(`^${prefix}`) });
  return `NOT-${year}-${String(count + 1).padStart(4, "0")}`;
}

function normalizeSignatories(
  items?: Array<{ name?: string; designation?: string }>
): Array<{ name: string; designation: string }> {
  if (!items?.length) {
    return [
      { name: "", designation: "প্রধান শিক্ষক" },
      { name: "", designation: "সহকারী প্রধান শিক্ষক" },
    ];
  }
  return items
    .slice(0, 3)
    .map((item) => ({
      name: String(item.name ?? "").trim(),
      designation: String(item.designation ?? "").trim(),
    }))
    .filter((item) => item.name || item.designation);
}

export async function listNotices(filterInput?: {
  status?: string;
  audience?: string;
  q?: string;
  category?: string;
}) {
  const filter: Record<string, unknown> = {};
  if (filterInput?.status === "published") filter.isPublished = true;
  if (filterInput?.status === "draft") filter.isPublished = false;
  if (filterInput?.audience) filter.audience = filterInput.audience;
  if (filterInput?.category) filter.category = filterInput.category;
  if (filterInput?.q?.trim()) {
    const q = filterInput.q.trim();
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { body: { $regex: q, $options: "i" } },
      { refNo: { $regex: q, $options: "i" } },
    ];
  }
  return Notice.find(filter)
    .populate("classId", "name")
    .sort({ pinned: -1, createdAt: -1 });
}

export async function getNotice(id: string | undefined) {
  const recordId = requireId(id, "Notice");
  const item = await Notice.findById(recordId).populate("classId", "name");
  if (!item) throw new ApiError(404, msg.notFoundRead("Notice"));
  return item;
}

export async function createNotice(body: NoticeCreateBody, user?: AuthUser) {
  const audience = body.audience ?? "all";
  const isPublished = body.isPublished !== false;
  let showOnWebsite = body.showOnWebsite;
  if (showOnWebsite === undefined) {
    showOnWebsite = isPublished && audience === "all";
  }
  const refNo = body.refNo?.trim() || (await nextRefNo());
  return Notice.create({
    title: body.title,
    body: body.body,
    audience,
    classId: body.classId || undefined,
    isPublished,
    refNo,
    issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
    category: body.category ?? "general",
    signatories: normalizeSignatories(body.signatories),
    showOnWebsite: Boolean(showOnWebsite) && audience === "all",
    pinned: Boolean(body.pinned),
    createdByName: user?.name ?? "",
  });
}

export async function updateNotice(id: string | undefined, body: unknown) {
  const payload =
    body && typeof body === "object" ? { ...(body as Record<string, unknown>) } : body;
  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    if ("signatories" in data) {
      data.signatories = normalizeSignatories(data.signatories as Array<{ name?: string; designation?: string }>);
    }
    if ("classId" in data && !data.classId) {
      data.classId = undefined;
    }
    if (data.audience && data.audience !== "all") {
      data.showOnWebsite = false;
    }
    if (data.issueDate && typeof data.issueDate === "string" && data.issueDate) {
      data.issueDate = new Date(data.issueDate);
    }
  }
  return updateDocument(Notice, id, payload, "Notice");
}

export async function deleteNotice(id: string | undefined) {
  return deleteDocument(Notice, id, "Notice");
}

export async function listPublicNotices() {
  return Notice.find({
    isPublished: true,
    showOnWebsite: true,
    audience: "all",
  })
    .select("title body refNo issueDate category signatories pinned createdAt createdByName")
    .sort({ pinned: -1, issueDate: -1, createdAt: -1 })
    .limit(50);
}
