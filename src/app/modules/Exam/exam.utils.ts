import { GradingRule } from "../../../models/GradingRule";

export function weightsSumTo100(weights: { weight: number }[]): boolean {
  const sum = weights.reduce((acc, item) => acc + item.weight, 0);
  return Math.abs(sum - 100) <= 0.01;
}

export async function resolveGradingRule(academicYear: string, classId?: string) {
  if (classId) {
    const byClass = await GradingRule.findOne({ academicYear, classId });
    if (byClass) return byClass;
  }
  return GradingRule.findOne({
    academicYear,
    isDefault: true,
    $or: [{ classId: { $exists: false } }, { classId: null }],
  });
}
