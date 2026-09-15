import type { LedgerStatus } from "./fee.interface";

export function ledgerStatus(dueAmount: number, paidAmount: number, discount: number): LedgerStatus {
  const remaining = dueAmount - discount - paidAmount;
  if (remaining <= 0) return "paid";
  if (paidAmount > 0) return "partial";
  return "due";
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
