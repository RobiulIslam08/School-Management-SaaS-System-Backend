import { Book, BookIssue } from "../../../models/Operations";
import { ApiError } from "../../../utils/ApiError";
import { msg } from "../../../utils/messages";
import { requireId, requirePayload } from "../../../utils/persist";
import { availableAfterCopyChange, canDeleteBook, canReduceCopies, issuedCount } from "./library.utils";

export async function listBooks() {
  return Book.find().sort({ title: 1 });
}

export async function createBook(body: { title: string; author?: string; isbn?: string; copies: number }) {
  return Book.create({ ...body, available: body.copies });
}

export async function updateBook(id: string | undefined, body: unknown) {
  const recordId = requireId(id, "Book");
  const payload = requirePayload(body, "Book");
  const book = await Book.findById(recordId);
  if (!book) throw new ApiError(404, msg.notFound("Book"));
  const nextCopies = typeof payload.copies === "number" ? payload.copies : book.copies;
  const issued = issuedCount(book.copies, book.available);
  if (!canReduceCopies(nextCopies, issued)) {
    throw new ApiError(409, msg.updateBlocked("Book", "Copies cannot be lower than books still issued."));
  }
  if (payload.title !== undefined) book.title = String(payload.title);
  if (payload.author !== undefined) book.author = String(payload.author);
  if (payload.isbn !== undefined) book.isbn = String(payload.isbn);
  if (typeof payload.copies === "number") {
    book.copies = nextCopies;
    book.available = availableAfterCopyChange(nextCopies, issued);
  }
  if (!book.isModified()) {
    throw new ApiError(400, msg.noChanges("Book"));
  }
  await book.save();
  return book;
}

export async function deleteBook(id: string | undefined) {
  const recordId = requireId(id, "Book");
  const openIssues = await BookIssue.countDocuments({ bookId: recordId, status: "issued" });
  if (!canDeleteBook(openIssues)) {
    throw new ApiError(409, msg.updateBlocked("Book", "Return issued copies before deleting this title."));
  }
  const book = await Book.findByIdAndDelete(recordId);
  if (!book) throw new ApiError(404, msg.notFoundRead("Book"));
  return { deleted: true };
}

export async function listIssues() {
  return BookIssue.find().populate("bookId", "title").populate("studentId", "name studentId").sort({ createdAt: -1 });
}

export async function issueBook(input: { bookId: string; studentId: string; dueAt: string }) {
  const book = await Book.findById(input.bookId);
  if (!book) throw new ApiError(404, msg.notFoundRead("Book"));
  if (book.available < 1) {
    throw new ApiError(409, msg.invalid("Book issue", "No copies are available."));
  }
  book.available -= 1;
  await book.save();
  try {
    return await BookIssue.create(input);
  } catch (error) {
    book.available += 1;
    await book.save();
    throw error;
  }
}

export async function returnBook(id: string | undefined) {
  const recordId = requireId(id, "Book issue");
  const issue = await BookIssue.findById(recordId);
  if (!issue) throw new ApiError(404, msg.notFoundRead("Book issue"));
  if (issue.status === "returned") {
    throw new ApiError(400, msg.noChanges("Book issue"));
  }
  issue.status = "returned";
  issue.returnedAt = new Date();
  await issue.save();
  const book = await Book.findById(issue.bookId);
  if (book) {
    book.available = Math.min(book.copies, book.available + 1);
    await book.save();
  }
  return issue;
}
