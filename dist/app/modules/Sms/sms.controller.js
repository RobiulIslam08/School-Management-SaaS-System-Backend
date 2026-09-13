"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsController = void 0;
const messages_1 = require("../../../utils/messages");
const respond_1 = require("../../../utils/respond");
const sms_service_1 = require("./sms.service");
exports.smsController = {
    async list(_req, res) {
        const items = await (0, sms_service_1.listSms)();
        (0, respond_1.ok)(res, items, messages_1.msg.loaded("SMS logs", items.length));
    },
    async send(req, res) {
        const result = await (0, sms_service_1.queueSms)(req.body);
        (0, respond_1.ok)(res, result, `${messages_1.msg.saved("SMS queue")} Gateway is not connected yet.`);
    },
};
