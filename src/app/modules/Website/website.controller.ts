import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import {
  createAlbum,
  createFile,
  createInquiry,
  createMedia,
  createPage,
  createPerson,
  createPost,
  deleteAlbum,
  deleteFile,
  deleteMedia,
  deletePage,
  deletePerson,
  deletePost,
  getAdminBundle,
  getPublicAlbum,
  getPublicPage,
  getPublicPost,
  getPublicRoutine,
  getPublicSite,
  listPublicExams,
  lookupPublicReceipts,
  lookupPublicResult,
  markInquiry,
  publicFile,
  publicMerit,
  saveConfig,
  updateAlbum,
  updatePage,
  updatePerson,
  updatePost,
} from "./website.service";
import { listSyllabus, publicSyllabus, upsertSyllabus } from "./syllabus.service";

export const websiteController = {
  async admin(_req: Request, res: Response): Promise<void> {
    ok(res, await getAdminBundle(), msg.loaded("Website"));
  },
  async saveConfig(req: Request, res: Response): Promise<void> {
    ok(res, await saveConfig(req.body), msg.updated("Website"));
  },
  async createPage(req: Request, res: Response): Promise<void> {
    ok(res, await createPage(req.body), msg.saved("Page"), 201);
  },
  async updatePage(req: Request, res: Response): Promise<void> {
    ok(res, await updatePage(routeParam(req.params.id), req.body), msg.updated("Page"));
  },
  async deletePage(req: Request, res: Response): Promise<void> {
    ok(res, await deletePage(routeParam(req.params.id)), msg.deleted("Page"));
  },
  async createPost(req: Request, res: Response): Promise<void> {
    ok(res, await createPost(req.body), msg.saved("Post"), 201);
  },
  async updatePost(req: Request, res: Response): Promise<void> {
    ok(res, await updatePost(routeParam(req.params.id), req.body), msg.updated("Post"));
  },
  async deletePost(req: Request, res: Response): Promise<void> {
    ok(res, await deletePost(routeParam(req.params.id)), msg.deleted("Post"));
  },
  async createAlbum(req: Request, res: Response): Promise<void> {
    ok(res, await createAlbum(req.body), msg.saved("Album"), 201);
  },
  async updateAlbum(req: Request, res: Response): Promise<void> {
    ok(res, await updateAlbum(routeParam(req.params.id), req.body), msg.updated("Album"));
  },
  async deleteAlbum(req: Request, res: Response): Promise<void> {
    ok(res, await deleteAlbum(routeParam(req.params.id)), msg.deleted("Album"));
  },
  async createMedia(req: Request, res: Response): Promise<void> {
    ok(res, await createMedia(req.body), msg.saved("Media"), 201);
  },
  async deleteMedia(req: Request, res: Response): Promise<void> {
    ok(res, await deleteMedia(routeParam(req.params.id)), msg.deleted("Media"));
  },
  async createPerson(req: Request, res: Response): Promise<void> {
    ok(res, await createPerson(req.body), msg.saved("Person"), 201);
  },
  async updatePerson(req: Request, res: Response): Promise<void> {
    ok(res, await updatePerson(routeParam(req.params.id), req.body), msg.updated("Person"));
  },
  async deletePerson(req: Request, res: Response): Promise<void> {
    ok(res, await deletePerson(routeParam(req.params.id)), msg.deleted("Person"));
  },
  async createFile(req: Request, res: Response): Promise<void> {
    const created = await createFile(req.body);
    ok(res, { _id: created._id, filename: created.filename, size: created.size }, msg.saved("File"), 201);
  },
  async deleteFile(req: Request, res: Response): Promise<void> {
    ok(res, await deleteFile(routeParam(req.params.id)), msg.deleted("File"));
  },
  async markInquiry(req: Request, res: Response): Promise<void> {
    ok(res, await markInquiry(routeParam(req.params.id), req.body.read !== false), msg.updated("Inquiry"));
  },
  async site(_req: Request, res: Response): Promise<void> {
    ok(res, await getPublicSite(), msg.loaded("Website"));
  },
  async page(req: Request, res: Response): Promise<void> {
    ok(res, await getPublicPage(routeParam(req.params.slug)), msg.loaded("Page"));
  },
  async post(req: Request, res: Response): Promise<void> {
    ok(res, await getPublicPost(routeParam(req.params.id)), msg.loaded("Post"));
  },
  async album(req: Request, res: Response): Promise<void> {
    ok(res, await getPublicAlbum(routeParam(req.params.id)), msg.loaded("Album"));
  },
  async syllabus(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const outlines = await publicSyllabus(classId);
    ok(res, outlines, msg.loaded("Syllabus", outlines.length));
  },
  async syllabusAdmin(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const outlines = await listSyllabus(classId);
    ok(res, outlines, msg.loaded("Syllabus", outlines.length));
  },
  async saveSyllabus(req: Request, res: Response): Promise<void> {
    ok(res, await upsertSyllabus(req.body), msg.saved("Syllabus"));
  },
  async routine(req: Request, res: Response): Promise<void> {
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const section = typeof req.query.section === "string" ? req.query.section : undefined;
    const slots = await getPublicRoutine(classId, section);
    ok(res, slots, msg.loaded("Routine", slots.length));
  },
  async exams(_req: Request, res: Response): Promise<void> {
    const exams = await listPublicExams();
    ok(res, exams, msg.loaded("Exams", exams.length));
  },
  async lookup(req: Request, res: Response): Promise<void> {
    const rows = await lookupPublicResult(req.body);
    ok(res, rows, msg.loaded("Result", rows.length));
  },
  async receipts(req: Request, res: Response): Promise<void> {
    const data = await lookupPublicReceipts(req.body);
    ok(res, data, msg.loaded("Receipt", data.receipts.length));
  },
  async merit(req: Request, res: Response): Promise<void> {
    const examTypeId = typeof req.query.examTypeId === "string" ? req.query.examTypeId : undefined;
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    ok(res, await publicMerit(examTypeId, classId), msg.loaded("Merit list"));
  },
  async inquiry(req: Request, res: Response): Promise<void> {
    ok(res, await createInquiry(req.body), msg.saved("Message"), 201);
  },
  async download(req: Request, res: Response): Promise<void> {
    const file = await publicFile(routeParam(req.params.id));
    const filename = String(file.filename || "file.pdf").replace(/[^a-zA-Z0-9._-]/g, "") || "file.pdf";
    res.setHeader("Content-Type", file.mime || "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.send(file.data);
  },
};
