import type { LedgerStatus } from "./fee.interface";

export function ledgerStatus(dueAmount: number, paidAmount: number, discount: number): LedgerStatus {
  const remaining = dueAmount - discount - paidAmount;
  if (remaining <= 0) return "paid";
  if (paidAmount > 0) return "partial";
  return "due";
}

/** "Library Fee (Sep26)" → "Library Fee". A bare title stays as-is. */
export function feeHeadName(title: string): string {
  const trimmed = title.trim();
  const match = trimmed.match(/^(.*)\s+\([^)]*\)$/);
  return (match?.[1] ?? trimmed).trim();
}

export function feeTitleMatchesHead(title: string, head: string): boolean {
  const value = title.trim();
  return value === head || value.startsWith(`${head} (`) || value.startsWith(`${head}(`);
}

export type FeeLedgerPick<T> = { kind: "pay"; ledger: T } | { kind: "over"; ledger: T };

/**
 * A month-specific payment matches that exact title, or a bare ledger of the same head.
 * It does not take a different month's open ledger.
 */
export function pickFeeLedger<T extends { title: string }>(
  open: T[],
  printed: string,
  amount: number,
  remainingOf: (row: T) => number
): FeeLedgerPick<T> | null {
  const head = feeHeadName(printed);
  const target = printed.trim();
  const withBalance = open.filter((row) => remainingOf(row) > 0 && feeTitleMatchesHead(row.title, head));
  const exact = withBalance.filter((row) => row.title.trim() === target);
  const bare = target === head ? [] : withBalance.filter((row) => row.title.trim() === head);
  const matches = exact.length ? exact : bare;
  if (!matches.length) return null;
  const fits = matches.filter((row) => remainingOf(row) >= amount);
  if (fits.length) return { kind: "pay", ledger: fits[0] };
  const blocked = [...matches].sort((a, b) => remainingOf(b) - remainingOf(a))[0];
  return { kind: "over", ledger: blocked };
}

export type ClassFeeRow = {
  classId: string;
  name: string;
  due: number;
  collected: number;
  studentCount: number;
};

type LedgerLike = {
  dueAmount: number;
  paidAmount: number;
  discount?: number;
  studentId?: {
    _id?: unknown;
    classId?: { _id?: unknown; name?: string } | string | null;
  } | null;
};

export function aggregateFeesByClass(ledgers: LedgerLike[]): ClassFeeRow[] {
  const map = new Map<string, ClassFeeRow & { students: Set<string> }>();
  for (const ledger of ledgers) {
    const student = ledger.studentId && typeof ledger.studentId === "object" ? ledger.studentId : undefined;
    const classRef = student?.classId;
    const classId =
      classRef && typeof classRef === "object" ? String(classRef._id ?? "none") : String(classRef ?? "none");
    const name = classRef && typeof classRef === "object" ? (classRef.name ?? "—") : "—";
    const studentKey = student?._id ? String(student._id) : "";
    const due = Math.max(ledger.dueAmount - (ledger.discount ?? 0) - ledger.paidAmount, 0);
    const current = map.get(classId) ?? {
      classId,
      name,
      due: 0,
      collected: 0,
      studentCount: 0,
      students: new Set<string>(),
    };
    current.due += due;
    current.collected += ledger.paidAmount;
    if (studentKey) current.students.add(studentKey);
    current.studentCount = current.students.size;
    map.set(classId, current);
  }
  return [...map.values()]
    .map(({ students: _students, ...row }) => row)
    .sort((a, b) => a.name.localeCompare(b.name));
}
