export type SubjectCreateBody = {
  name: string;
  nameBn?: string;
  code: string;
  classId: string;
  group?: "Science" | "Business" | "Humanities" | "Common";
  markDistribution?: { cq: number; mcq: number; practical: number; attendance: number };
  sortOrder?: number;
  compulsory?: boolean;
  teacherId?: string;
  isActive?: boolean;
};
