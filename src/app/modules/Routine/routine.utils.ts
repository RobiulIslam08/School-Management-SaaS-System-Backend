export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export function isWeekday(day: number): boolean {
  return day >= 0 && day <= 6;
}
