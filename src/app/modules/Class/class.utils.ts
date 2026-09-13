import type { ClassSection } from "../../../models/ClassStructure";

export function asSections(raw: unknown): ClassSection[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [{ name: "A", capacity: 0 }];
  }
  return raw.map((item) => {
    if (typeof item === "string") {
      return { name: item, capacity: 0 };
    }
    const row = item as { name?: string; capacity?: number; classTeacherId?: unknown };
    return {
      name: String(row.name ?? "A"),
      capacity: Number(row.capacity ?? 0),
      classTeacherId: row.classTeacherId as ClassSection["classTeacherId"],
    };
  });
}

export function sectionNames(raw: unknown): string[] {
  return asSections(raw).map((item) => item.name);
}
