import { Notice } from "../../../models/Notice";
import type { NoticeAudience } from "./notice.interface";
import { deleteDocument, updateDocument } from "../../../utils/persist";

export async function listNotices() {
  return Notice.find().populate("classId", "name").sort({ createdAt: -1 });
}

export async function createNotice(body: {
  title: string;
  body: string;
  audience?: NoticeAudience;
  classId?: string;
  isPublished?: boolean;
}) {
  return Notice.create({
    title: body.title,
    body: body.body,
    audience: body.audience ?? "all",
    classId: body.classId || undefined,
    isPublished: body.isPublished !== false,
  });
}

export async function updateNotice(id: string | undefined, body: unknown) {
  return updateDocument(Notice, id, body, "Notice");
}

export async function deleteNotice(id: string | undefined) {
  return deleteDocument(Notice, id, "Notice");
}
