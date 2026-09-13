"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.ROLES = void 0;
exports.hasPermission = hasPermission;
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
    "exams",
    "results",
    "fees",
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
        ...expand(["students", "academics", "attendance", "exams", "results", "notices", "talent", "certificates"], ["view"]),
        ...expand(["attendance", "exams"], ["create", "edit"]),
        ...expand(["results"], ["create", "edit"]),
    ],
    accountant: [
        ...expand(["fees", "payroll", "reports", "students"], ["view"]),
        ...expand(["fees", "payroll"], ["create", "edit", "delete"]),
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
