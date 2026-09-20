import { z } from "zod";

export const bookCreateValidation = z.object({
  title: z.string().min(1, "Book title is required"),
  author: z.string().optional(),
  isbn: z.string().optional(),
  copies: z.number().int().positive(),
  collectedAt: z.string().optional().or(z.literal("")),
});

export const bookUpdateValidation = bookCreateValidation.partial();

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");

export const bookIssueValidation = z.object({
  bookId: objectId,
  studentId: objectId,
  dueAt: z.string().min(1, "Due date is required"),
});
