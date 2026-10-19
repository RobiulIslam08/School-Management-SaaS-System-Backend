"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const accounts_service_1 = require("./accounts.service");
exports.accountsController = {
    async summary(req, res) {
        (0, respond_1.ok)(res, await (0, accounts_service_1.accountsSummary)({
            year: typeof req.query.year === "string" ? req.query.year : undefined,
            month: typeof req.query.month === "string" ? req.query.month : undefined,
        }), messages_1.msg.loaded("Accounts summary"));
    },
};
