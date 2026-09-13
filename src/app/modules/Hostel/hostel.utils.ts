export function occupancyPct(occupied: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((occupied / capacity) * 100));
}

export function canSetOccupied(occupied: number, capacity: number): boolean {
  return occupied >= 0 && occupied <= capacity;
}

export function canDeleteHostel(occupied: number): boolean {
  return occupied <= 0;
}
