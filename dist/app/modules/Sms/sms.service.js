"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSms = listSms;
exports.queueSms = queueSms;
exports.smsQueueMessage = smsQueueMessage;
const Notice_1 = require("../../../models/Notice");
const Student_1 = require("../../../models/Student");
const Teacher_1 = require("../../../models/Teacher");
const dispatch_1 = require("../../../lib/sms/dispatch");
const phone_1 = require("../../../lib/sms/phone");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function listSms() {
    return Notice_1.SmsLog.find().sort({ createdAt: -1 }).limit(100);
}
async function queueSms(input) {
    let phones = input.phones ?? [];
    if (input.audience === "all_guardians") {
        const students = await Student_1.Student.find({ status: "active" }).select("guardian.phone guardian.fatherPhone");
        phones = students
            .map((item) => (0, phone_1.normalizeBdPhone)(item.guardian?.phone) ?? (0, phone_1.normalizeBdPhone)(item.guardian?.fatherPhone) ?? "")
            .filter(Boolean);
    }
    if (input.audience === "class" && input.classId) {
        const students = await Student_1.Student.find({ classId: input.classId, status: "active" }).select("guardian.phone guardian.fatherPhone");
        phones = students
            .map((item) => (0, phone_1.normalizeBdPhone)(item.guardian?.phone) ?? (0, phone_1.normalizeBdPhone)(item.guardian?.fatherPhone) ?? "")
            .filter(Boolean);
    }
    if (input.audience === "teachers") {
        const teachers = await Teacher_1.Teacher.find({ isActive: true }).select("phone");
        phones = teachers.map((item) => (0, phone_1.normalizeBdPhone)(item.phone) ?? "").filter(Boolean);
    }
    phones = [...new Set(phones)];
    if (!phones.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("SMS", "No phone numbers were found for this audience."));
    }
    const summary = await (0, dispatch_1.dispatchSms)(phones.map((to) => ({
        to,
        body: input.body,
        template: input.template ?? "custom",
        audience: input.audience,
    })));
    return { ...summary, queued: summary.sent + summary.failed };
}
function smsQueueMessage(summary) {
    const base = messages_1.msg.saved("SMS");
    return `${base}${(0, dispatch_1.smsNote)(summary)}`.trim();
}
