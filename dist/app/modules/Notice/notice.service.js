"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextRefFromExisting = nextRefFromExisting;
exports.listNotices = listNotices;
exports.getNotice = getNotice;
exports.createNotice = createNotice;
exports.updateNotice = updateNotice;
exports.deleteNotice = deleteNotice;
exports.getPublicNotice = getPublicNotice;
exports.listPublicNotices = listPublicNotices;
const mongoose_1 = __importDefault(require("mongoose"));
const Notice_1 = require("../../../models/Notice");
const SchoolSettings_1 = require("../../../models/SchoolSettings");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/** Next notice number from the highest existing suffix, so a deleted notice is not reused. */
function nextRefFromExisting(year, existing) {
    const prefix = `NOT-${year}-`;
    let max = 0;
    for (const ref of existing) {
        if (!ref.startsWith(prefix))
            continue;
        const value = Number(ref.slice(prefix.length));
        if (Number.isInteger(value) && value > max)
            max = value;
    }
    return `${prefix}${String(max + 1).padStart(4, "0")}`;
}
async function nextRefNo() {
    const settings = await SchoolSettings_1.SchoolSettings.findOne().select("academicYear");
    const year = settings?.academicYear ?? String(new Date().getFullYear());
    const prefix = `NOT-${escapeRegExp(year)}-`;
    const rows = await Notice_1.Notice.find({ refNo: new RegExp(`^${prefix}`) }).select("refNo").lean();
    return nextRefFromExisting(year, rows.map((row) => row.refNo ?? ""));
}
function normalizeSignatories(items) {
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
async function listNotices(filterInput) {
    const filter = {};
    if (filterInput?.status === "published")
        filter.isPublished = true;
    if (filterInput?.status === "draft")
        filter.isPublished = false;
    if (filterInput?.audience)
        filter.audience = filterInput.audience;
    if (filterInput?.category)
        filter.category = filterInput.category;
    if (filterInput?.q?.trim()) {
        const q = filterInput.q.trim();
        filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { body: { $regex: q, $options: "i" } },
            { refNo: { $regex: q, $options: "i" } },
        ];
    }
    return Notice_1.Notice.find(filter)
        .populate("classId", "name")
        .sort({ pinned: -1, createdAt: -1 });
}
async function getNotice(id) {
    const recordId = (0, persist_1.requireId)(id, "Notice");
    const item = await Notice_1.Notice.findById(recordId).populate("classId", "name");
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Notice"));
    return item;
}
async function createNotice(body, user) {
    const audience = body.audience ?? "all";
    const isPublished = body.isPublished !== false;
    let showOnWebsite = body.showOnWebsite;
    if (showOnWebsite === undefined) {
        showOnWebsite = isPublished && audience === "all";
    }
    const refNo = body.refNo?.trim() || (await nextRefNo());
    return Notice_1.Notice.create({
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
async function updateNotice(id, body) {
    const payload = body && typeof body === "object" ? { ...body } : body;
    if (payload && typeof payload === "object") {
        const data = payload;
        if ("signatories" in data) {
            data.signatories = normalizeSignatories(data.signatories);
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
    return (0, persist_1.updateDocument)(Notice_1.Notice, id, payload, "Notice");
}
async function deleteNotice(id) {
    return (0, persist_1.deleteDocument)(Notice_1.Notice, id, "Notice");
}
const publicNoticeSelect = "title body refNo issueDate category signatories pinned createdAt createdByName";
async function getPublicNotice(id) {
    if (!mongoose_1.default.isValidObjectId(String(id ?? "")))
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Notice"));
    const notice = await Notice_1.Notice.findOne({
        _id: id,
        isPublished: true,
        showOnWebsite: true,
        audience: "all",
    }).select(publicNoticeSelect);
    if (!notice)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Notice"));
    return notice;
}
async function listPublicNotices() {
    return Notice_1.Notice.find({
        isPublished: true,
        showOnWebsite: true,
        audience: "all",
    })
        .select(publicNoticeSelect)
        .sort({ pinned: -1, issueDate: -1, createdAt: -1 })
        .limit(80);
}
