"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedOrigin = isAllowedOrigin;
function isAllowedOrigin(requestOrigin, configuredOrigin) {
    if (!requestOrigin)
        return true;
    if (!configuredOrigin)
        return requestOrigin;
    return requestOrigin === configuredOrigin ? requestOrigin : false;
}
