import { normalizeBdPhone, fatherNotifyPhone, guardianNotifyPhone } from "../src/lib/sms/phone";
import { parseBulkSmsResponse } from "../src/lib/sms/bulksmsbd";
import { admissionSuccessSms, attendanceAbsentSms, payrollPaidSms } from "../src/lib/sms/templates";

describe("normalizeBdPhone", () => {
  it("normalizes local and international formats", () => {
    expect(normalizeBdPhone("01712345678")).toBe("8801712345678");
    expect(normalizeBdPhone("+8801712345678")).toBe("8801712345678");
    expect(normalizeBdPhone("8801712345678")).toBe("8801712345678");
    expect(normalizeBdPhone("1712345678")).toBe("8801712345678");
  });

  it("rejects invalid numbers", () => {
    expect(normalizeBdPhone("")).toBeNull();
    expect(normalizeBdPhone("123")).toBeNull();
    expect(normalizeBdPhone("abcd")).toBeNull();
  });
});

describe("notify phone helpers", () => {
  it("prefers guardian phone for admission", () => {
    expect(guardianNotifyPhone({ phone: "01711111111", fatherPhone: "01722222222" })).toBe("8801711111111");
    expect(guardianNotifyPhone({ phone: "", fatherPhone: "01722222222" })).toBe("8801722222222");
  });

  it("prefers father phone for absence", () => {
    expect(fatherNotifyPhone({ phone: "01711111111", fatherPhone: "01722222222" })).toBe("8801722222222");
    expect(fatherNotifyPhone({ phone: "01711111111", fatherPhone: "" })).toBe("8801711111111");
  });
});

describe("parseBulkSmsResponse", () => {
  it("treats 202 as success", () => {
    const result = parseBulkSmsResponse(JSON.stringify({ response_code: 202, success_message: "OK" }));
    expect(result.ok).toBe(true);
    expect(result.code).toBe(202);
  });

  it("maps known error codes", () => {
    const result = parseBulkSmsResponse(JSON.stringify({ response_code: 1007, error_message: "Balance" }));
    expect(result.ok).toBe(false);
    expect(result.code).toBe(1007);
    expect(result.message).toMatch(/balance/i);
  });
});

describe("sms templates", () => {
  it("builds bangla bodies", () => {
    expect(admissionSuccessSms({ schoolName: "ABC", studentName: "Rahim", studentId: "121201", className: "Six" })).toContain(
      "ভর্তি সম্পন্ন"
    );
    expect(attendanceAbsentSms({ schoolName: "ABC", studentName: "Rahim", date: "2026-09-21" })).toContain("অনুপস্থিত");
    expect(payrollPaidSms({ schoolName: "ABC", teacherName: "Karim", month: "2026-09", net: 25000 })).toContain("বেতন");
  });
});
