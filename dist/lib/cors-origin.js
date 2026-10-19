"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedOrigin = isAllowedOrigin;
function isAllowedOrigin(requestOrigin, configuredOrigin) {
    if (!requestOrigin)
        return true;
    const list = (Array.isArray(configuredOrigin) ? configuredOrigin : [configuredOrigin])
        .flatMap((item) => item.split(","))
        .map((item) => item.trim())
        .filter(Boolean);
    if (!list.length)
        return requestOrigin;
    return list.includes(requestOrigin) ? requestOrigin : false;
}
