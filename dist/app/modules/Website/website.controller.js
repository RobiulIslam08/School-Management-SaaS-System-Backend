"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteController = void 0;
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const website_service_1 = require("./website.service");
const syllabus_service_1 = require("./syllabus.service");
exports.websiteController = {
    async admin(_req, res) {
        (0, respond_1.ok)(res, await (0, website_service_1.getAdminBundle)(), messages_1.msg.loaded("Website"));
    },
    async saveConfig(req, res) {
        const result = await (0, website_service_1.saveConfig)(req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.updated("Website"));
    },
    async createPage(req, res) {
        const result = await (0, website_service_1.createPage)(req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.saved("Page"), 201);
    },
    async updatePage(req, res) {
        const result = await (0, website_service_1.updatePage)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.updated("Page"));
    },
    async deletePage(req, res) {
        const result = await (0, website_service_1.deletePage)((0, persist_1.routeParam)(req.params.id));
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Page"));
    },
    async createPost(req, res) {
        const result = await (0, website_service_1.createPost)(req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.saved("Post"), 201);
    },
    async updatePost(req, res) {
        const result = await (0, website_service_1.updatePost)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.updated("Post"));
    },
    async deletePost(req, res) {
        const result = await (0, website_service_1.deletePost)((0, persist_1.routeParam)(req.params.id));
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Post"));
    },
    async createAlbum(req, res) {
        const result = await (0, website_service_1.createAlbum)(req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.saved("Album"), 201);
    },
    async updateAlbum(req, res) {
        const result = await (0, website_service_1.updateAlbum)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.updated("Album"));
    },
    async deleteAlbum(req, res) {
        const result = await (0, website_service_1.deleteAlbum)((0, persist_1.routeParam)(req.params.id));
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Album"));
    },
    async createMedia(req, res) {
        const result = await (0, website_service_1.createMedia)(req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.saved("Media"), 201);
    },
    async deleteMedia(req, res) {
        const result = await (0, website_service_1.deleteMedia)((0, persist_1.routeParam)(req.params.id));
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Media"));
    },
    async createPerson(req, res) {
        const result = await (0, website_service_1.createPerson)(req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.saved("Person"), 201);
    },
    async updatePerson(req, res) {
        const result = await (0, website_service_1.updatePerson)((0, persist_1.routeParam)(req.params.id), req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.updated("Person"));
    },
    async deletePerson(req, res) {
        const result = await (0, website_service_1.deletePerson)((0, persist_1.routeParam)(req.params.id));
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("Person"));
    },
    async createFile(req, res) {
        const created = await (0, website_service_1.createFile)(req.body);
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, { _id: created._id, filename: created.filename, size: created.size }, messages_1.msg.saved("File"), 201);
    },
    async deleteFile(req, res) {
        const result = await (0, website_service_1.deleteFile)((0, persist_1.routeParam)(req.params.id));
        (0, website_service_1.invalidatePublicSiteCache)();
        (0, respond_1.ok)(res, result, messages_1.msg.deleted("File"));
    },
    async markInquiry(req, res) {
        (0, respond_1.ok)(res, await (0, website_service_1.markInquiry)((0, persist_1.routeParam)(req.params.id), req.body.read !== false), messages_1.msg.updated("Inquiry"));
    },
    async site(_req, res) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        (0, respond_1.ok)(res, await (0, website_service_1.getPublicSite)(), messages_1.msg.loaded("Website"));
    },
    async page(req, res) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        (0, respond_1.ok)(res, await (0, website_service_1.getPublicPage)((0, persist_1.routeParam)(req.params.slug)), messages_1.msg.loaded("Page"));
    },
    async post(req, res) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        (0, respond_1.ok)(res, await (0, website_service_1.getPublicPost)((0, persist_1.routeParam)(req.params.id)), messages_1.msg.loaded("Post"));
    },
    async album(req, res) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        (0, respond_1.ok)(res, await (0, website_service_1.getPublicAlbum)((0, persist_1.routeParam)(req.params.id)), messages_1.msg.loaded("Album"));
    },
    async syllabus(req, res) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const outlines = await (0, syllabus_service_1.publicSyllabus)(classId);
        (0, respond_1.ok)(res, outlines, messages_1.msg.loaded("Syllabus", outlines.length));
    },
    async syllabusAdmin(req, res) {
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const outlines = await (0, syllabus_service_1.listSyllabus)(classId);
        (0, respond_1.ok)(res, outlines, messages_1.msg.loaded("Syllabus", outlines.length));
    },
    async saveSyllabus(req, res) {
        (0, respond_1.ok)(res, await (0, syllabus_service_1.upsertSyllabus)(req.body), messages_1.msg.saved("Syllabus"));
    },
    async routine(req, res) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        const section = typeof req.query.section === "string" ? req.query.section : undefined;
        const slots = await (0, website_service_1.getPublicRoutine)(classId, section);
        (0, respond_1.ok)(res, slots, messages_1.msg.loaded("Routine", slots.length));
    },
    async exams(_req, res) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        const exams = await (0, website_service_1.listPublicExams)();
        (0, respond_1.ok)(res, exams, messages_1.msg.loaded("Exams", exams.length));
    },
    async lookup(req, res) {
        const rows = await (0, website_service_1.lookupPublicResult)(req.body);
        (0, respond_1.ok)(res, rows, messages_1.msg.loaded("Result", rows.length));
    },
    async receipts(req, res) {
        const data = await (0, website_service_1.lookupPublicReceipts)(req.body);
        (0, respond_1.ok)(res, data, messages_1.msg.loaded("Receipt", data.receipts.length));
    },
    async merit(req, res) {
        const examTypeId = typeof req.query.examTypeId === "string" ? req.query.examTypeId : undefined;
        const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
        (0, respond_1.ok)(res, await (0, website_service_1.publicMerit)(examTypeId, classId), messages_1.msg.loaded("Merit list"));
    },
    async inquiry(req, res) {
        (0, respond_1.ok)(res, await (0, website_service_1.createInquiry)(req.body), messages_1.msg.saved("Message"), 201);
    },
    async download(req, res) {
        const file = await (0, website_service_1.publicFile)((0, persist_1.routeParam)(req.params.id));
        const filename = String(file.filename || "file.pdf").replace(/[^a-zA-Z0-9._-]/g, "") || "file.pdf";
        res.setHeader("Content-Type", file.mime || "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.send(file.data);
    },
};
