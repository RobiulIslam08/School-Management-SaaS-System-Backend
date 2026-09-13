import type { LedgerStatus } from "./fee.interface";

export function ledgerStatus(dueAmount: number, paidAmount: number, discount: number): LedgerStatus {
  const remaining = dueAmount - discount - paidAmount;
  if (remaining <= 0) return "paid";
  if (paidAmount > 0) return "partial";
  return "due";
}
