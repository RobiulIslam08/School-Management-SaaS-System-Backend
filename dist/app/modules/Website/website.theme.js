"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHex = normalizeHex;
exports.luminance = luminance;
exports.contrastRatio = contrastRatio;
exports.readableOn = readableOn;
exports.themeTokens = themeTokens;
const PRESET_PRIMARY = {
    heritage: "#14532d",
    royal: "#0b3d6e",
    crimson: "#9f1239",
    azure: "#0e7490",
};
function normalizeHex(input, fallback = "#14532d") {
    const value = input.trim();
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback;
}
function channel(hex, index) {
    return Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
}
function linearize(value) {
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
    const safe = normalizeHex(hex);
    const r = linearize(channel(safe, 0));
    const g = linearize(channel(safe, 1));
    const b = linearize(channel(safe, 2));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(foreground, background) {
    const lighter = luminance(foreground);
    const darker = luminance(background);
    const [hi, lo] = lighter > darker ? [lighter, darker] : [darker, lighter];
    return (hi + 0.05) / (lo + 0.05);
}
function readableOn(background) {
    const white = contrastRatio("#ffffff", background);
    const ink = contrastRatio("#111111", background);
    if (white >= 4.5 && white >= ink)
        return "#ffffff";
    if (ink >= 4.5)
        return "#111111";
    return white >= ink ? "#ffffff" : "#111111";
}
function themeTokens(preset, customPrimary) {
    const known = preset === "royal" || preset === "crimson" || preset === "azure" || preset === "custom" ? preset : "heritage";
    const primary = known === "custom" ? normalizeHex(customPrimary) : PRESET_PRIMARY[known];
    return {
        preset: known,
        primary,
        onPrimary: readableOn(primary),
        accent: "#8a6a32",
        surface: "#f6f3ec",
        ink: "#1c1917",
        radius: "0.75rem",
    };
}
