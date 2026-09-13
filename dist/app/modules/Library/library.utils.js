"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issuedCount = issuedCount;
exports.availableAfterCopyChange = availableAfterCopyChange;
exports.canReduceCopies = canReduceCopies;
exports.canDeleteBook = canDeleteBook;
function issuedCount(copies, available) {
    return Math.max(0, copies - available);
}
function availableAfterCopyChange(copies, issued) {
    return copies - issued;
}
function canReduceCopies(copies, issued) {
    return copies >= issued;
}
function canDeleteBook(openIssues) {
    return openIssues === 0;
}
