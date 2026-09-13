"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.examController = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const respond_1 = require("../../../utils/respond");
const exam_service_1 = require("./exam.service");
exports.examController = {
    async listExams(req, res) {
        const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
        const items = await (0, exam_service_1.listExams)(year);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Exams", items.length));
    },
    async createExam(req, res) {
        const created = await (0, exam_service_1.createExam)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Exam type"), 201);
    },
    async publish(req, res) {
        const updated = await (0, exam_service_1.publishExam)((0, persist_1.routeParam)(req.params.id), Boolean(req.body.isPublished));
        (0, respond_1.ok)(res, updated, messages_1.msg.updated("Exam"));
    },
    async listRules(req, res) {
        const year = typeof req.query.academicYear === "string" ? req.query.academicYear : undefined;
        const items = await (0, exam_service_1.listGradingRules)(year);
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Grading formulas", items.length));
    },
    async createRule(req, res) {
        const created = await (0, exam_service_1.createGradingRule)(req.body);
        (0, respond_1.ok)(res, created, messages_1.msg.saved("Grading formula"), 201);
    },
    async listResults(req, res) {
        const items = await (0, exam_service_1.listResults)({
            examTypeId: req.query.examTypeId,
            studentId: req.query.studentId,
            classId: req.query.classId,
            section: req.query.section,
        });
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("Results", items.length));
    },
    async saveResult(req, res) {
        const saved = await (0, exam_service_1.upsertResult)(req.body, req.user);
        (0, respond_1.ok)(res, saved.record, saved.created ? messages_1.msg.saved("Marks") : messages_1.msg.updated("Marks"));
    },
    async merit(req, res) {
        const ranked = await (0, exam_service_1.recomputeMerit)((0, persist_1.routeParam)(req.params.examTypeId));
        (0, respond_1.ok)(res, ranked, messages_1.msg.updated("Merit list"));
    },
    async final(req, res) {
        const year = String(req.query.academicYear ?? new Date().getFullYear());
        (0, respond_1.ok)(res, await (0, exam_service_1.finalGrade)((0, persist_1.routeParam)(req.params.studentId) ?? "", year), messages_1.msg.loaded("Final grade"));
    },
    async exportXlsx(req, res) {
        const rows = await (0, exam_service_1.exportResults)((0, persist_1.routeParam)(req.params.examTypeId));
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet("Results");
        sheet.addRow(["Merit", "Student ID", "Name", "GPA", "Letter", "Total"]);
        rows.forEach((row) => {
            const student = row.studentId;
            sheet.addRow([row.meritPosition, student?.studentId, student?.name, row.gpa, row.letter, row.totalObtained]);
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=results.xlsx");
        await workbook.xlsx.write(res);
        res.end();
    },
};
