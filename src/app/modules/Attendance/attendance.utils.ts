export function attendanceFilter(query: Record<string, unknown>): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (query.classId) filter.classId = query.classId;
  if (query.section) filter.section = query.section;
  if (query.date) filter.date = query.date;
  if (query.studentId) filter.studentId = query.studentId;
  return filter;
}
