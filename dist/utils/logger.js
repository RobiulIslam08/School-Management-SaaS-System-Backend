"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info(message, meta) {
        console.info(JSON.stringify({ level: "info", message, ...meta }));
    },
    error(message, meta) {
        const safe = { ...meta };
        delete safe.password;
        delete safe.token;
        delete safe.uri;
        console.error(JSON.stringify({ level: "error", message, ...safe }));
    },
};
