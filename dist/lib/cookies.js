"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = setAuthCookies;
exports.clearAuthCookies = clearAuthCookies;
const env_1 = require("../config/env");
const base = {
    httpOnly: true,
    sameSite: env_1.env.cookieSameSite,
    secure: env_1.env.cookieSecure || env_1.isProd || env_1.env.cookieSameSite === "none",
    path: "/",
};
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, { ...base, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 });
}
function clearAuthCookies(res) {
    res.clearCookie("accessToken", { ...base });
    res.clearCookie("refreshToken", { ...base });
}
