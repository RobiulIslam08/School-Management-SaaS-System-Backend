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
    ...expand(
      ["students", "academics", "attendance", "staffAttendance", "exams", "results", "notices", "talent", "certificates"],
      ["view"]
    ),
    ...expand(["attendance", "staffAttendance", "exams"], ["create", "edit"]),
    ...expand(["results"], ["create", "edit"]),
  ],
  accountant: [
    ...expand(["fees", "payroll", "expenses", "donations", "accounts", "reports", "students"], ["view"]),
    ...expand(["fees", "payroll", "expenses", "donations"], ["create", "edit", "delete"]),
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

/** Role defaults union custom grants so new modules aren't locked out by stale DB snapshots. */
export function effectivePermissions(role: Role, custom: string[] = []): string[] {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  if (!custom.length) return [...rolePerms];
  return Array.from(new Set([...rolePerms, ...custom]));
}
