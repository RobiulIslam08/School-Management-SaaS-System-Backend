"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBulkSmsResponse = parseBulkSmsResponse;
exports.sendBulkSmsBd = sendBulkSmsBd;
const http_1 = __importDefault(require("http"));
const SMS_API_URL = "http://bulksmsbd.net/api/smsapi";
const CODE_MESSAGES = {
    202: "SMS submitted successfully",
    1001: "Invalid number",
    1002: "Sender ID incorrect or disabled",
    1003: "Required fields missing",
    1005: "Internal error",
    1006: "Balance validity not available",
    1007: "Insufficient balance",
    1011: "User ID not found",
    1012: "Masking SMS must be in Bengali",
    1013: "Sender ID problem",
    1014: "Gateway problem",
    1015: "Pricing problem",
    1016: "Sender ID not found",
    1017: "Sender ID pending",
    1018: "Account disabled",
    1019: "Account not found",
    1020: "Parent account problem",
    1021: "Parent account not found",
    1031: "Account not verified",
    1032: "IP not whitelisted",
};
function parseBulkSmsResponse(raw) {
    const text = String(raw ?? "").trim();
    let code = null;
    let message = text || "Empty gateway response";
    try {
        const json = JSON.parse(text);
        const codeRaw = json.response_code ?? json.responseCode ?? json.code;
        if (typeof codeRaw === "number")
            code = codeRaw;
        else if (typeof codeRaw === "string" && /^\d+$/.test(codeRaw))
            code = Number(codeRaw);
        const success = typeof json.success_message === "string" ? json.success_message : "";
        const error = typeof json.error_message === "string" ? json.error_message : "";
        message = success || error || CODE_MESSAGES[code ?? -1] || text;
    }
    catch {
        const match = text.match(/\b(\d{3,4})\b/);
        if (match) {
            code = Number(match[1]);
            message = CODE_MESSAGES[code] ?? text;
        }
    }
    return {
        ok: code === 202,
        code,
        message: (message || CODE_MESSAGES[code ?? -1] || "Unknown SMS gateway error").trim(),
        raw: text,
    };
}
function httpGetText(url, timeoutMs = 20_000) {
    return new Promise((resolve, reject) => {
        const req = http_1.default.get(url, { timeout: timeoutMs }, (res) => {
            let body = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => resolve(body));
        });
        req.on("error", reject);
        req.on("timeout", () => {
            req.destroy();
            reject(new Error("Gateway request timed out"));
        });
    });
}
async function sendBulkSmsBd(input) {
    const params = new URLSearchParams({
        api_key: input.apiKey,
        type: "text",
        number: input.number,
        senderid: input.senderId,
        message: input.message,
    });
    try {
        const raw = await httpGetText(`${SMS_API_URL}?${params.toString()}`);
        return parseBulkSmsResponse(raw);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Gateway request failed";
        return { ok: false, code: null, message, raw: "" };
    }
}
