export function buildStudentFilter(query: Record<string, unknown>): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (query.classId) filter.classId = query.classId;
  if (query.section) filter.section = query.section;
  if (query.status) filter.status = query.status;
  if (query.district) filter["address.district"] = query.district;
  if (query.area) filter["address.area"] = query.area;
  if (query.tag) filter.talentTags = query.tag;
  if (query.q && typeof query.q === "string") {
    filter.$or = [
      { name: new RegExp(query.q, "i") },
      { nameBn: new RegExp(query.q, "i") },
      { studentId: new RegExp(query.q, "i") },
      { phone: new RegExp(query.q, "i") },
      { "guardian.phone": new RegExp(query.q, "i") },
    ];
  }
  return filter;
}

export type ClassSerialRef = {
  id: string;
  code: string;
  level: number;
};

/** First 4-digit year in the batch label. `2026-27` stays `2026`. */
export function batchYear(academicYear: string | undefined, now = new Date()): string {
  const match = String(academicYear ?? "").match(/\d{4}/);
  return match?.[0] ?? String(now.getFullYear());
}

/** 1-based index among classes that share a level, sorted by code. Omitted when the level is unique. */
export function siblingIndex(classes: ClassSerialRef[], classId: string): number | undefined {
  const target = classes.find((row) => row.id === classId);
  if (!target) return undefined;
  const same = classes.filter((row) => row.level === target.level).sort((a, b) => a.code.localeCompare(b.code));
  if (same.length <= 1) return undefined;
  return same.findIndex((row) => row.id === classId) + 1;
}

/** `{level}{year}` or `{level}{sibling}{year}` when several classes share the level. */
export function studentIdPrefix(level: number, year: string, sibling?: number): string {
  return sibling ? `${level}${sibling}${year}` : `${level}${year}`;
}

export function nextSerialForPrefix(ids: string[], prefix: string): number {
  const pattern = new RegExp(`^${prefix}(\\d+)$`);
  let max = 0;
  for (const id of ids) {
    const match = pattern.exec(id);
    if (!match) continue;
    const serial = Number(match[1]);
    if (serial > max) max = serial;
  }
  return max + 1;
}

export function formatStudentId(prefix: string, serial: number): string {
  return `${prefix}${String(serial).padStart(3, "0")}`;
}

export function prefixForClass(
  classes: ClassSerialRef[],
  classId: string | undefined,
  academicYear: string | undefined,
  now = new Date()
): string {
  const year = batchYear(academicYear, now);
  const target = classId ? classes.find((row) => row.id === classId) : undefined;
  const level = target?.level ?? 0;
  const sibling = classId ? siblingIndex(classes, classId) : undefined;
  return studentIdPrefix(level, year, sibling);
}

/** Class level + batch year + serial. Existing IDs outside that prefix are ignored. */
export function nextStudentIdFromRoster(
  classes: ClassSerialRef[],
  classId: string | undefined,
  academicYear: string | undefined,
  existingIds: string[],
  now = new Date()
): string {
  const prefix = prefixForClass(classes, classId, academicYear, now);
  return formatStudentId(prefix, nextSerialForPrefix(existingIds, prefix));
}
