export const ROLES = [
  "platform_owner",
  "school_admin",
  "teacher",
  "accountant",
  "guardian",
] as const;

export type Role = (typeof ROLES)[number];

export type Permission = `${string}:${"view" | "create" | "edit" | "delete" | "approve"}`;

const ALL_MODULES = [
  "settings",
  "students",
  "admission",
  "teachers",
  "academics",
  "attendance",
  "staffAttendance",
  "exams",
  "results",
  "fees",
  "expenses",
  "donations",
  "accounts",
  "sms",
  "notices",
  "payroll",
  "talent",
  "reports",
  "library",
  "transport",
  "hostel",
  "idCards",
  "certificates",
  "users",
  "owner",
] as const;

function allActions(module: string): Permission[] {
  return [
    `${module}:view`,
    `${module}:create`,
    `${module}:edit`,
    `${module}:delete`,
    `${module}:approve`,
  ] as Permission[];
}

function expand(modules: string[], actions: Array<"view" | "create" | "edit" | "delete" | "approve">): Permission[] {
  return modules.flatMap((module) => actions.map((action) => `${module}:${action}` as Permission));
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  platform_owner: ALL_MODULES.flatMap((module) => allActions(module)),
  school_admin: ALL_MODULES.filter((module) => module !== "owner").flatMap((module) => allActions(module)),
  teacher: [
    ...expand(["students", "academics", "exams", "notices", "talent", "certificates"], ["view"]),
    ...expand(["attendance"], ["view", "create", "edit"]),
    ...expand(["results"], ["view", "create", "edit", "approve"]),
  ],
  accountant: [
    ...expand(["students", "accounts", "reports", "notices"], ["view"]),
    ...expand(["fees", "payroll", "expenses", "donations"], ["view", "create", "edit", "delete"]),
    ...expand(["payroll"], ["approve"]),
  ],
  guardian: expand(["results", "fees", "notices", "attendance", "students"], ["view"]),
};

export function hasPermission(role: Role, permissions: string[], needed: Permission): boolean {
  if (role === "platform_owner") return true;
  if (permissions.includes(needed)) return true;
  const [mod] = needed.split(":");
  return permissions.includes(`${mod}:*`);
}

/**
 * Empty custom → live role defaults.
 * Non-empty custom → admin override only (no union with role defaults).
 */
export function effectivePermissions(role: Role, custom: string[] = []): string[] {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  if (!custom.length) return [...rolePerms];
  return [...custom];
}
