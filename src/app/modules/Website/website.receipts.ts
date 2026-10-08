export const RECEIPT_MISS = "No payment receipt matched those details.";

const FEE_HEADS = [
  "Monthly Tuition Fee",
  "Admission Fee",
  "Library Fee",
  "ID Card Fee",
  "Journal And Magazine Fee",
  "Common Room Fee",
  "Student Welfare Fee",
  "College Sports Fee",
  "Red Crescent Fee",
  "Seminar Fee",
  "BNCC Fee",
  "Religious Ceremony Fee",
  "Cultural Programme Fee",
  "College Development Fee",
  "Computerized Progress Report Card Fee",
  "SMS and Online Service Charge",
  "Uniform",
] as const;

export type ReceiptLine = {
  title: string;
  amount: number;
};

export type PublicReceipt = {
  receiptNo: string;
  date: string;
  method: string;
  refNo: string;
  academicYear: string;
  lines: ReceiptLine[];
  amount: number;
};

export type ReceiptSource = {
  ledgerId: string;
  academicYear: string;
  ledgerTitle: string;
  paymentId: string;
  amount: number;
  method: string;
  refNo: string;
  receiptNo: string;
  date: Date | string | null;
  particular: string;
};

function feeHeadName(title: string): string {
  const trimmed = title.trim();
  const match = trimmed.match(/^(.*)\s+\([^)]*\)$/);
  return (match?.[1] ?? trimmed).trim();
}

function feeLineOrder(title: string): number {
  const index = FEE_HEADS.indexOf(feeHeadName(title) as (typeof FEE_HEADS)[number]);
  return index === -1 ? FEE_HEADS.length : index;
}

function stampDay(date: Date | string | null | undefined): string {
  const parsed = date ? new Date(date) : new Date();
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return parsed.toISOString().slice(0, 10).replace(/-/g, "");
}

export function legacyReceiptNo(paymentId: string, ledgerId: string, date: Date | string | null | undefined): string {
  const stamp = (paymentId || ledgerId).slice(-6).toUpperCase();
  return `FEE-${stampDay(date)}-${stamp}`;
}

function isoDate(value: Date | string | null): string {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

/** One slip per receipt number. Lines without a number stay separate. Newest slip first. */
export function groupPublicReceipts(rows: ReceiptSource[]): PublicReceipt[] {
  const items = rows
    .filter((row) => row.amount > 0)
    .map((row, index) => ({ ...row, index }))
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      const left = Number.isNaN(da) ? 0 : da;
      const right = Number.isNaN(db) ? 0 : db;
      if (right !== left) return right - left;
      return a.index - b.index;
    });

  const map = new Map<string, { receipt: PublicReceipt; lines: ReceiptLine[] }>();
  const order: string[] = [];

  for (const item of items) {
    const stored = item.receiptNo.trim();
    const groupKey = stored || `${item.ledgerId}:${item.paymentId || item.index}`;
    let group = map.get(groupKey);
    if (!group) {
      group = {
        receipt: {
          receiptNo: stored || legacyReceiptNo(item.paymentId, item.ledgerId, item.date),
          date: isoDate(item.date),
          method: item.method,
          refNo: item.refNo.trim(),
          academicYear: item.academicYear,
          lines: [],
          amount: 0,
        },
        lines: [],
      };
      map.set(groupKey, group);
      order.push(groupKey);
    }
    group.lines.push({
      title: item.particular.trim() || item.ledgerTitle.trim() || "Fee",
      amount: item.amount,
    });
  }

  return order.map((key) => {
    const group = map.get(key)!;
    const lines = [...group.lines].sort(
      (a, b) => feeLineOrder(a.title) - feeLineOrder(b.title) || a.title.localeCompare(b.title)
    );
    const amount = lines.reduce((sum, line) => sum + line.amount, 0);
    return { ...group.receipt, lines, amount };
  });
}
