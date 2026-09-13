import type { ClassSection } from "../../../models/ClassStructure";

export type ClassCreateBody = {
  name: string;
  code: string;
  level: number;
  sortOrder?: number;
  group?: "Science" | "Business" | "Humanities" | "None";
  sections?: Array<string | Partial<ClassSection>>;
  isActive?: boolean;
};

export type ClassSectionBody = {
  name: string;
  capacity?: number;
  classTeacherId?: string;
};
