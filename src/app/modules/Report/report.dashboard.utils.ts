export function monthRange(offset = 0, from = new Date()): { start: Date; end: Date } {
  const start = new Date(from.getFullYear(), from.getMonth() + offset, 1);
  const end = new Date(from.getFullYear(), from.getMonth() + offset + 1, 1);
  return { start, end };
}

export function isoDate(value = new Date()): string {
  return value.toISOString().slice(0, 10);
}

export function trendPct(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function lastDays(count: number, from = new Date()): string[] {
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(from);
    day.setDate(from.getDate() - (count - 1 - index));
    return isoDate(day);
  });
}

export type TopPerformer = {
  id: string;
  name: string;
  gpa: number;
  studentId: string;
};

/** Keep the first (highest GPA) row per student, then cap the list. */
export function uniqueTopPerformers(
  rows: Array<TopPerformer | null | undefined>,
  limit = 5,
): TopPerformer[] {
  const seen = new Set<string>();
  const unique: TopPerformer[] = [];
  for (const row of rows) {
    if (!row?.id || seen.has(row.id)) continue;
    seen.add(row.id);
    unique.push(row);
    if (unique.length >= limit) break;
  }
  return unique;
}
