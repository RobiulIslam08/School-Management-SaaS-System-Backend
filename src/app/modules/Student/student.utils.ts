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

/** School-wide sequential IDs start at 121201. Legacy formats (e.g. 2026-GEN-001) are ignored. */
export const STUDENT_ID_START = 121201;

export function nextStudentIdFromExisting(ids: string[], start = STUDENT_ID_START): string {
  let max = start - 1;
  for (const id of ids) {
    if (!/^\d+$/.test(id)) continue;
    const n = Number(id);
    if (n >= start && n > max) max = n;
  }
  return String(max + 1);
}
