"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSms = listSms;
exports.queueSms = queueSms;
const Notice_1 = require("../../../models/Notice");
const Student_1 = require("../../../models/Student");
const Teacher_1 = require("../../../models/Teacher");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
async function listSms() {
    return Notice_1.SmsLog.find().sort({ createdAt: -1 }).limit(100);
}
async function queueSms(input) {
    let phones = input.phones ?? [];
    if (input.audience === "all_guardians") {
        const students = await Student_1.Student.find({ status: "active" }).select("guardian.phone");
        phones = students.map((item) => item.guardian.phone).filter(Boolean);
    }
    if (input.audience === "class" && input.classId) {
        const students = await Student_1.Student.find({ classId: input.classId, status: "active" }).select("guardian.phone");
        phones = students.map((item) => item.guardian.phone).filter(Boolean);
    }
    if (input.audience === "teachers") {
        const teachers = await Teacher_1.Teacher.find({ isActive: true }).select("phone");
        phones = teachers.map((item) => item.phone).filter(Boolean);
    }
    if (!phones.length) {
        throw new ApiError_1.ApiError(400, messages_1.msg.invalid("SMS", "No phone numbers were found for this audience."));
    }
    const logs = await Notice_1.SmsLog.insertMany(phones.map((to) => ({
        to,
        body: input.body,
        template: input.template ?? "custom",
        status: "queued",
        audience: input.audience,
    })));
    return { queued: logs.length };
}
