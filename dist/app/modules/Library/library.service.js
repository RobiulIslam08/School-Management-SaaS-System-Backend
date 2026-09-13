"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBooks = listBooks;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
exports.listIssues = listIssues;
exports.issueBook = issueBook;
exports.returnBook = returnBook;
const Operations_1 = require("../../../models/Operations");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const library_utils_1 = require("./library.utils");
async function listBooks() {
    return Operations_1.Book.find().sort({ title: 1 });
}
async function createBook(body) {
    return Operations_1.Book.create({ ...body, available: body.copies });
}
async function updateBook(id, body) {
    const recordId = (0, persist_1.requireId)(id, "Book");
    const payload = (0, persist_1.requirePayload)(body, "Book");
    const book = await Operations_1.Book.findById(recordId);
    if (!book)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Book"));
    const nextCopies = typeof payload.copies === "number" ? payload.copies : book.copies;
    const issued = (0, library_utils_1.issuedCount)(book.copies, book.available);
    if (!(0, library_utils_1.canReduceCopies)(nextCopies, issued)) {
        throw new ApiError_1.ApiError(409, messages_1.msg.updateBlocked("Book", "Copies cannot be lower than books still issued."));
    }
    if (payload.title !== undefined)
        book.title = String(payload.title);
    if (payload.author !== undefined)
        book.author = String(payload.author);
    if (payload.isbn !== undefined)
        book.isbn = String(payload.isbn);
    if (typeof payload.copies === "number") {
        book.copies = nextCopies;
        book.available = (0, library_utils_1.availableAfterCopyChange)(nextCopies, issued);
    }
    if (!book.isModified()) {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Book"));
    }
    await book.save();
    return book;
}
async function deleteBook(id) {
    const recordId = (0, persist_1.requireId)(id, "Book");
    const openIssues = await Operations_1.BookIssue.countDocuments({ bookId: recordId, status: "issued" });
    if (!(0, library_utils_1.canDeleteBook)(openIssues)) {
        throw new ApiError_1.ApiError(409, messages_1.msg.updateBlocked("Book", "Return issued copies before deleting this title."));
    }
    const book = await Operations_1.Book.findByIdAndDelete(recordId);
    if (!book)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Book"));
    return { deleted: true };
}
async function listIssues() {
    return Operations_1.BookIssue.find().populate("bookId", "title").populate("studentId", "name studentId").sort({ createdAt: -1 });
}
async function issueBook(input) {
    const book = await Operations_1.Book.findById(input.bookId);
    if (!book)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Book"));
    if (book.available < 1) {
        throw new ApiError_1.ApiError(409, messages_1.msg.invalid("Book issue", "No copies are available."));
    }
    book.available -= 1;
    await book.save();
    try {
        return await Operations_1.BookIssue.create(input);
    }
    catch (error) {
        book.available += 1;
        await book.save();
        throw error;
    }
}
async function returnBook(id) {
    const recordId = (0, persist_1.requireId)(id, "Book issue");
    const issue = await Operations_1.BookIssue.findById(recordId);
    if (!issue)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Book issue"));
    if (issue.status === "returned") {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Book issue"));
    }
    issue.status = "returned";
    issue.returnedAt = new Date();
    await issue.save();
    const book = await Operations_1.Book.findById(issue.bookId);
    if (book) {
        book.available = Math.min(book.copies, book.available + 1);
        await book.save();
    }
    return issue;
}
