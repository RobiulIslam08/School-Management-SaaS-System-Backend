"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightsSumTo100 = weightsSumTo100;
exports.resolveGradingRule = resolveGradingRule;
const GradingRule_1 = require("../../../models/GradingRule");
function weightsSumTo100(weights) {
    const sum = weights.reduce((acc, item) => acc + item.weight, 0);
    return Math.abs(sum - 100) <= 0.01;
}
async function resolveGradingRule(academicYear, classId) {
    if (classId) {
        const byClass = await GradingRule_1.GradingRule.findOne({ academicYear, classId });
        if (byClass)
            return byClass;
    }
    return GradingRule_1.GradingRule.findOne({
        academicYear,
        isDefault: true,
        $or: [{ classId: { $exists: false } }, { classId: null }],
    });
}
