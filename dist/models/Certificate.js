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
exports.IssuedCertificate = exports.CertificateTemplate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const certificate_utils_1 = require("../app/modules/Certificate/certificate.utils");
const templateSchema = new mongoose_1.Schema({
    kind: { type: String, required: true, enum: certificate_utils_1.CERTIFICATE_KINDS },
    name: { type: String, required: true, trim: true },
    titleBn: { type: String, required: true },
    titleEn: { type: String, required: true },
    bodyBn: { type: String, required: true },
    bodyEn: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: "CertificateTemplates" });
templateSchema.index({ kind: 1, name: 1 }, { unique: true });
exports.CertificateTemplate = mongoose_1.default.model("CertificateTemplate", templateSchema);
const issuedSchema = new mongoose_1.Schema({
    certNo: { type: String, required: true, unique: true },
    templateId: { type: mongoose_1.Schema.Types.ObjectId, ref: "CertificateTemplate", required: true },
    kind: { type: String, required: true, enum: certificate_utils_1.CERTIFICATE_KINDS },
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    issueDate: { type: Date, required: true },
    purpose: { type: String, default: "" },
    conduct: { type: String, default: "good" },
    leavingDate: { type: Date },
    reason: { type: String, default: "" },
    language: { type: String, enum: ["bn", "en"], default: "bn" },
    issuedByName: { type: String, default: "" },
    renderedTitle: { type: String, required: true },
    renderedBody: { type: String, required: true },
    revokedAt: { type: Date, default: null },
}, { timestamps: true, collection: "IssuedCertificates" });
issuedSchema.index({ studentId: 1, createdAt: -1 });
issuedSchema.index({ kind: 1, issueDate: -1 });
issuedSchema.index({ revokedAt: 1 });
exports.IssuedCertificate = mongoose_1.default.model("IssuedCertificate", issuedSchema);
