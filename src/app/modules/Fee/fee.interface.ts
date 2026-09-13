export type LedgerStatus = "due" | "partial" | "paid";

export type PaymentInput = {
  amount: number;
  method: string;
  refNo?: string;
  note?: string;
  date?: string;
};
