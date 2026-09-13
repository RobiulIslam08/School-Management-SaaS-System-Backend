"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolSettings = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const settingsSchema = new mongoose_1.Schema({
    name: { type: String, required: true, default: "Your School" },
    logoUrl: { type: String, default: "" },
    address: { type: String, default: "" },
    eiin: { type: String, default: "" },
    establishedYear: { type: Number, default: null },
    motto: { type: String, default: "" },
    theme: {
        primary: { type: String, default: "#14532d" },
        radius: { type: String, default: "0.75rem" },
    },
    academicYear: { type: String, default: "2026" },
    smsApiKey: { type: String, default: "" },
    defaultLanguage: { type: String, enum: ["bn", "en"], default: "bn" },
}, { timestamps: true, collection: "SchoolSettings" });
exports.SchoolSettings = mongoose_1.default.model("SchoolSettings", settingsSchema);
