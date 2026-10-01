export type LedgerStatus = "due" | "partial" | "paid";

export type PaymentInput = {
  amount: number;
  method: string;
  refNo?: string;
  note?: string;
  date?: string;
  receiptNo?: string;
  particular?: string;
};

export type BatchPaymentLine = {
  ledgerId?: string;
  title?: string;
  amount: number;
};

export type BatchPaymentInput = {
  studentId?: string;
  method: string;
  refNo?: string;
  note?: string;
  date?: string;
  lines: BatchPaymentLine[];
};

export type BatchPaymentResult = {
  receiptNo: string;
  method: string;
  refNo: string;
  date: string;
  academicYear: string;
  student: { name: string; studentId: string; className: string };
  lines: Array<{ ledgerId: string; title: string; amount: number }>;
};
