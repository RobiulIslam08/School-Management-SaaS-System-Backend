export interface StaffPublic {
  id: unknown;
  name: string;
  email?: string;
  role: string;
  permissions?: string[];
  isActive?: boolean;
}
