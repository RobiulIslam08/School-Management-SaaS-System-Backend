"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPayroll = listPayroll;
exports.createPayroll = createPayroll;
exports.markPaid = markPaid;
exports.payrollPayMessage = payrollPayMessage;
const Operations_1 = require("../../../models/Operations");
const Teacher_1 = require("../../../models/Teacher");
const dispatch_1 = require("../../../lib/sms/dispatch");
const phone_1 = require("../../../lib/sms/phone");
const templates_1 = require("../../../lib/sms/templates");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const payroll_utils_1 = require("./payroll.utils");
async function listPayroll() {
    return Operations_1.Payroll.find({ deletedAt: null }).populate("teacherId", "name staffId photoUrl");
}
async function createPayroll(input) {
    const teacher = await Teacher_1.Teacher.findById(input.teacherId);
    if (!teacher)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFoundRead("Teacher"));
    const basic = teacher.salaryStructure.basic;
    const allowances = teacher.salaryStructure.house + teacher.salaryStructure.medical + teacher.salaryStructure.other;
    const advance = input.advance ?? 0;
    const deduction = input.deduction ?? 0;
    return Operations_1.Payroll.create({
        teacherId: teacher._id,
        month: input.month,
        basic,
        allowances,
        advance,
        deduction,
        net: (0, payroll_utils_1.computeNet)(basic, allowances, advance, deduction),
    });
}
async function markPaid(id) {
    const recordId = (0, persist_1.requireId)(id, "Payslip");
    const item = await Operations_1.Payroll.findById(recordId);
    if (!item)
        throw new ApiError_1.ApiError(404, messages_1.msg.notFound("Payslip"));
    if (item.status === "paid") {
        throw new ApiError_1.ApiError(400, messages_1.msg.noChanges("Payslip"));
    }
    item.status = "paid";
    item.paidAt = new Date();
    await item.save();
    const sms = await sendPayrollSms(item);
    return { item, sms };
}
async function sendPayrollSms(item) {
    if (!(await (0, dispatch_1.isSmsTriggerEnabled)("payroll")))
        return (0, dispatch_1.emptySmsSummary)();
    const teacher = await Teacher_1.Teacher.findById(item.teacherId).select("name phone");
    if (!teacher)
        return (0, dispatch_1.emptySmsSummary)();
    const to = (0, phone_1.normalizeBdPhone)(teacher.phone);
    if (!to)
        return { sent: 0, failed: 0, skipped: 1 };
    const schoolName = await (0, dispatch_1.getSmsSchoolName)();
    return (0, dispatch_1.dispatchSms)([
        {
            to,
            body: (0, templates_1.payrollPaidSms)({
                schoolName,
                teacherName: teacher.name,
                month: item.month,
                net: item.net,
            }),
            template: "payroll_paid",
            audience: "teachers",
        },
    ]);
}
function payrollPayMessage(sms) {
    return `${messages_1.msg.updated("Payslip")}${(0, dispatch_1.smsNote)(sms)}`.trim();
}
