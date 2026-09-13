"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripSecrets = stripSecrets;
function stripSecrets(user) {
    const { passwordHash: _p, totpSecret: _t, ...safe } = user;
    return safe;
}
