"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_MS = exports.ACCESS_TOKEN_MS = void 0;
exports.setAuthCookies = setAuthCookies;
exports.clearAuthCookies = clearAuthCookies;
const env_1 = require("../config/env");
exports.ACCESS_TOKEN_MS = 15 * 60 * 1000;
exports.REFRESH_TOKEN_MS = 30 * 24 * 60 * 60 * 1000;
const base = {
    httpOnly: true,
    sameSite: env_1.env.cookieSameSite,
    secure: env_1.env.cookieSecure || env_1.isProd || env_1.env.cookieSameSite === "none",
    path: "/",
};
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, { ...base, maxAge: exports.ACCESS_TOKEN_MS });
    res.cookie("refreshToken", refreshToken, { ...base, maxAge: exports.REFRESH_TOKEN_MS });
}
function clearAuthCookies(res) {
    res.clearCookie("accessToken", { ...base });
    res.clearCookie("refreshToken", { ...base });
}
