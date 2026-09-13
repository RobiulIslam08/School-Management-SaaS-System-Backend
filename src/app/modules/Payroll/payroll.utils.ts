export function computeNet(basic: number, allowances: number, advance: number, deduction: number): number {
  return basic + allowances - advance - deduction;
}
