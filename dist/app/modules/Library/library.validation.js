"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookIssueValidation = exports.bookUpdateValidation = exports.bookCreateValidation = void 0;
const zod_1 = require("zod");
exports.bookCreateValidation = zod_1.z.object({
    title: zod_1.z.string().min(1, "Book title is required"),
    author: zod_1.z.string().optional(),
    isbn: zod_1.z.string().optional(),
    copies: zod_1.z.number().int().positive(),
});
exports.bookUpdateValidation = exports.bookCreateValidation.partial();
const objectId = zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, "Select a valid record");
exports.bookIssueValidation = zod_1.z.object({
    bookId: objectId,
    studentId: objectId,
    dueAt: zod_1.z.string().min(1, "Due date is required"),
});
