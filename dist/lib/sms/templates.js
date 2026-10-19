"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionSuccessSms = admissionSuccessSms;
exports.attendanceAbsentSms = attendanceAbsentSms;
exports.payrollPaidSms = payrollPaidSms;
function admissionSuccessSms(input) {
    const klass = input.className ? `, শ্রেণি: ${input.className}` : "";
    return `${input.schoolName}: ${input.studentName} (ID ${input.studentId})${klass} এর ভর্তি সম্পন্ন হয়েছে।`;
}
function attendanceAbsentSms(input) {
    const klass = input.className ? ` (${input.className})` : "";
    return `${input.schoolName}: ${input.studentName}${klass} আজ (${input.date}) অনুপস্থিত।`;
}
function payrollPaidSms(input) {
    return `${input.schoolName}: ${input.teacherName}, ${input.month} মাসের বেতন (নেট ${input.net} টাকা) প্রদান করা হয়েছে।`;
}
