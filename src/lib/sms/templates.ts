export function admissionSuccessSms(input: {
  schoolName: string;
  studentName: string;
  studentId: string;
  className?: string;
}): string {
  const klass = input.className ? `, শ্রেণি: ${input.className}` : "";
  return `${input.schoolName}: ${input.studentName} (ID ${input.studentId})${klass} এর ভর্তি সম্পন্ন হয়েছে।`;
}

export function attendanceAbsentSms(input: {
  schoolName: string;
  studentName: string;
  date: string;
  className?: string;
}): string {
  const klass = input.className ? ` (${input.className})` : "";
  return `${input.schoolName}: ${input.studentName}${klass} আজ (${input.date}) অনুপস্থিত।`;
}

export function payrollPaidSms(input: {
  schoolName: string;
  teacherName: string;
  month: string;
  net: number;
}): string {
  return `${input.schoolName}: ${input.teacherName}, ${input.month} মাসের বেতন (নেট ${input.net} টাকা) প্রদান করা হয়েছে।`;
}
