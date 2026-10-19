"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.ROLES = void 0;
exports.hasPermission = hasPermission;
exports.effectivePermissions = effectivePermissions;
exports.ROLES = [
    "platform_owner",
    "school_admin",
    "teacher",
    "accountant",
    "guardian",
];
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
    "website",
    "users",
    "owner",
];
function allActions(module) {
    return [
        `${module}:view`,
        `${module}:create`,
        `${module}:edit`,
        `${module}:delete`,
        `${module}:approve`,
    ];
}
function expand(modules, actions) {
    return modules.flatMap((module) => actions.map((action) => `${module}:${action}`));
}
exports.ROLE_PERMISSIONS = {
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
function hasPermission(role, permissions, needed) {
    if (role === "platform_owner")
        return true;
    if (permissions.includes(needed))
        return true;
    const [mod] = needed.split(":");
    return permissions.includes(`${mod}:*`);
}
/**
 * Empty custom → live role defaults.
 * Non-empty custom → admin override only (no union with role defaults).
 */
function effectivePermissions(role, custom = []) {
    const rolePerms = exports.ROLE_PERMISSIONS[role] ?? [];
    if (!custom.length)
        return [...rolePerms];
    return [...custom];
}
