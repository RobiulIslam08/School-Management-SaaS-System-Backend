/** Students marked absent now who were not already absent on this date. */
export function newlyAbsentStudentIds(
  entries: Array<{ studentId: string; status: string }>,
  alreadyAbsent: Iterable<string>
): string[] {
  const prior = new Set([...alreadyAbsent].map(String));
  return entries
    .filter((entry) => entry.status === "absent" && !prior.has(String(entry.studentId)))
    .map((entry) => entry.studentId);
}

export function attendanceFilter(query: Record<string, unknown>): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (query.classId) filter.classId = query.classId;
  if (query.section) filter.section = query.section;
  if (query.date) filter.date = query.date;
  if (query.studentId) filter.studentId = query.studentId;
  return filter;
}
