"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const library_service_1 = require("./library.service");
exports.libraryController = {
    async listBooks(_req, res) {
        const items = await (0, library_service_1.listBooks)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Books", items.length));
    },
    async createBook(req, res) {
        const created = await (0, library_service_1.createBook)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Book"), 201);
    },
    async updateBook(req, res) {
        const updated = await (0, library_service_1.updateBook)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Book"));
    },
    async removeBook(req, res) {
        await (0, library_service_1.deleteBook)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, { deleted: true }, messages_1.msg.deleted("Book"));
    },
    async listIssues(_req, res) {
        const items = await (0, library_service_1.listIssues)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Book issues", items.length));
    },
    async issue(req, res) {
        const created = await (0, library_service_1.issueBook)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Book issue"), 201);
    },
    async returnIssue(req, res) {
        const updated = await (0, library_service_1.returnBook)((0, persist_1.routeParam)(req.params.id));
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Book issue"));
    },
};
