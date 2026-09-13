"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const report_service_1 = require("./report.service");
exports.reportController = {
    async areas(_req, res) {
        const rows = await (0, report_service_1.areaReport)();
        (0, respond_1.ok)(res, rows, messages_1.msg.loaded("Area report", rows.length));
    },
    async talent(_req, res) {
        const rows = await (0, report_service_1.talentReport)();
        (0, respond_1.ok)(res, rows, messages_1.msg.loaded("Talent report", rows.length));
    },
    async dashboard(_req, res) {
        (0, respond_1.ok)(res, await (0, report_service_1.dashboard)(), messages_1.msg.loaded("Dashboard"));
    },
};
