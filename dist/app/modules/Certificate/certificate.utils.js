"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CERTIFICATE_TEMPLATES = exports.CERT_PREFIX = exports.CERTIFICATE_KINDS = void 0;
exports.escapeRegExp = escapeRegExp;
exports.formatCertNo = formatCertNo;
exports.fillPlaceholders = fillPlaceholders;
exports.CERTIFICATE_KINDS = ["character", "transfer", "testimonial", "merit"];
exports.CERT_PREFIX = {
    character: "CHAR",
    transfer: "TC",
    testimonial: "TEST",
    merit: "MERIT",
};
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function formatCertNo(kind, year, sequence) {
    return `${exports.CERT_PREFIX[kind]}-${year}-${String(sequence).padStart(4, "0")}`;
}
function fillPlaceholders(template, values) {
    return template.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_full, key) => {
        const value = values[key];
        if (value == null || value === "")
            return "—";
        return value;
    });
}
exports.DEFAULT_CERTIFICATE_TEMPLATES = [
    {
        kind: "character",
        name: "Character certificate",
        titleBn: "প্রশংসাপত্র",
        titleEn: "Character Certificate",
        bodyBn: "এই মর্মে প্রত্যয়ন করা যাইতেছে যে, {{student_name}} (শিক্ষার্থী আইডি: {{student_id}}, রোল: {{roll}}), পিতা {{father_name}}, মাতা {{mother_name}}, {{school_name}}-এর {{class}} শ্রেণি, শাখা {{section}}, শিক্ষাবর্ষ {{session}}-এর নিয়মিত শিক্ষার্থী। তাহার আচার-আচরণ ও চরিত্র {{conduct}}। এই প্রশংসাপত্র {{purpose}} এর প্রয়োজনে প্রদান করা হইল।",
        bodyEn: "This is to certify that {{student_name}} (ID: {{student_id}}, Roll: {{roll}}), son/daughter of {{father_name}} and {{mother_name}}, is a regular student of {{class}}, Section {{section}}, Session {{session}} at {{school_name}}. His/her conduct is {{conduct}}. This character certificate is issued for {{purpose}}.",
    },
    {
        kind: "transfer",
        name: "Transfer certificate",
        titleBn: "ছাড়পত্র",
        titleEn: "Transfer Certificate",
        bodyBn: "প্রত্যয়ন করা যাইতেছে যে, {{student_name}} (আইডি: {{student_id}}, রোল: {{roll}}), পিতা {{father_name}}, {{class}} শ্রেণি, শাখা {{section}}, শিক্ষাবর্ষ {{session}}-এ অধ্যয়নরত ছিলেন। তিনি {{leaving_date}} তারিখে বিদ্যালয় ত্যাগ করেন। ত্যাগের কারণ: {{reason}}। তাহার চরিত্র {{conduct}} এবং এই প্রতিষ্ঠানে তাহার কোনো বকেয়া নাই।",
        bodyEn: "This is to certify that {{student_name}} (ID: {{student_id}}, Roll: {{roll}}), son/daughter of {{father_name}}, studied in {{class}}, Section {{section}}, Session {{session}}. He/she left the institution on {{leaving_date}}. Reason: {{reason}}. Conduct is {{conduct}} and no dues remain payable to this school.",
    },
    {
        kind: "testimonial",
        name: "Testimonial",
        titleBn: "টেস্টিমোনিয়াল",
        titleEn: "Testimonial",
        bodyBn: "আমরা আনন্দের সহিত প্রত্যয়ন করিতেছি যে, {{student_name}} (আইডি: {{student_id}}), পিতা {{father_name}}, {{school_name}}-এর {{class}} শ্রেণির শিক্ষার্থী। অধ্যয়নকালে তিনি উত্তম চরিত্র ও শৃঙ্খলার পরিচয় দিয়াছেন ({{conduct}})। উচ্চশিক্ষা ও {{purpose}} এর জন্য তাহাকে সুপারিশ করা যাইতেছে।",
        bodyEn: "We are pleased to certify that {{student_name}} (ID: {{student_id}}), son/daughter of {{father_name}}, is a student of {{class}} at {{school_name}}. During the course of study his/her character has been {{conduct}}. He/she is recommended for higher studies and for {{purpose}}.",
    },
    {
        kind: "merit",
        name: "Merit certificate",
        titleBn: "মেধা সনদ",
        titleEn: "Merit Certificate",
        bodyBn: "প্রত্যয়ন করা যাইতেছে যে, {{student_name}} (আইডি: {{student_id}}, রোল: {{roll}}), {{class}} শ্রেণি, শাখা {{section}}, শিক্ষাবর্ষ {{session}}-এ মেধার স্বীকৃতিস্বরূপ এই সনদ প্রদান করা হইল। উদ্দেশ্য: {{purpose}}।",
        bodyEn: "This is to certify that {{student_name}} (ID: {{student_id}}, Roll: {{roll}}) of {{class}}, Section {{section}}, Session {{session}}, is awarded this merit certificate. Purpose: {{purpose}}.",
    },
];
