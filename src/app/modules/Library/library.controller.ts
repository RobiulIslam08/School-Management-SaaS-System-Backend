import type { Request, Response } from "express";
import { msg } from "../../../utils/messages";
import { routeParam } from "../../../utils/persist";
import { ok } from "../../../utils/respond";
import { createBook, deleteBook, issueBook, listBooks, listIssues, returnBook, updateBook } from "./library.service";

export const libraryController = {
  async listBooks(_req: Request, res: Response): Promise<void> {
    const items = await listBooks();
    ok(res, items, msg.loaded("Books", items.length));
  },
  async createBook(req: Request, res: Response): Promise<void> {
    const created = await createBook(req.body);
    ok(res, created, msg.saved("Book"), 201);
  },
  async updateBook(req: Request, res: Response): Promise<void> {
    const updated = await updateBook(routeParam(req.params.id), req.body);
    ok(res, updated, msg.updated("Book"));
  },
  async removeBook(req: Request, res: Response): Promise<void> {
    await deleteBook(routeParam(req.params.id));
    ok(res, { deleted: true }, msg.deleted("Book"));
  },
  async listIssues(_req: Request, res: Response): Promise<void> {
    const items = await listIssues();
    ok(res, items, msg.loaded("Book issues", items.length));
  },
  async issue(req: Request, res: Response): Promise<void> {
    const created = await issueBook(req.body);
    ok(res, created, msg.saved("Book issue"), 201);
  },
  async returnIssue(req: Request, res: Response): Promise<void> {
    const updated = await returnBook(routeParam(req.params.id));
    ok(res, updated, msg.updated("Book issue"));
  },
};
