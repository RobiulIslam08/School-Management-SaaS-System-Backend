"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPayroll = listPayroll;
exports.createPayroll = createPayroll;
exports.markPaid = markPaid;
const Operations_1 = require("../../../models/Operations");
const Teacher_1 = require("../../../models/Teacher");
const ApiError_1 = require("../../../utils/ApiError");
const messages_1 = require("../../../utils/messages");
const persist_1 = require("../../../utils/persist");
const payroll_utils_1 = require("./payroll.utils");
async function listPayroll() {
    return Operations_1.Payroll.find({ deletedAt: null }).populate("teacherId", "name staffId");
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
    return item;
}
