import { Donation, Expense } from "../../../models/Accounts";
import { FeeLedger } from "../../../models/Fee";
import { Payroll } from "../../../models/Operations";

function monthRange(year: string, month?: string) {
  if (month && /^\d{2}$/.test(month)) {
    const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    return { start, end };
  }
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
  return { start, end };
}

function inRange(date: Date, start: Date, end: Date) {
  return date >= start && date < end;
}

export async function accountsSummary(query: { year?: string; month?: string }) {
  const year = query.year || String(new Date().getFullYear());
  const month = query.month;
  const { start, end } = monthRange(year, month);

  const [expenses, donations, ledgers, payrolls] = await Promise.all([
    Expense.find({ deletedAt: null, date: { $gte: start, $lt: end } }),
    Donation.find({ deletedAt: null, date: { $gte: start, $lt: end } }),
    FeeLedger.find({ deletedAt: null }),
    Payroll.find({ deletedAt: null, status: "paid" }),
  ]);

  const expenseByCategory: Record<string, number> = {};
  let expenseTotal = 0;
  for (const item of expenses) {
    expenseTotal += item.amount;
    expenseByCategory[item.category] = (expenseByCategory[item.category] ?? 0) + item.amount;
  }

  let donationTotal = 0;
  for (const item of donations) donationTotal += item.amount;

  let feeTotal = 0;
  const feeByMethod: Record<string, number> = {};
  for (const ledger of ledgers) {
    for (const payment of ledger.payments ?? []) {
      const paidAt = payment.date ? new Date(payment.date) : null;
      if (!paidAt || !inRange(paidAt, start, end)) continue;
      feeTotal += payment.amount;
      feeByMethod[payment.method] = (feeByMethod[payment.method] ?? 0) + payment.amount;
    }
  }

  let payrollTotal = 0;
  for (const slip of payrolls) {
    const paidAt = slip.paidAt ? new Date(slip.paidAt) : null;
    if (!paidAt || !inRange(paidAt, start, end)) continue;
    // month field is YYYY-MM — also accept if paid in range
    payrollTotal += slip.net;
  }
  expenseByCategory.salary = (expenseByCategory.salary ?? 0) + payrollTotal;
  const expenseWithSalary = expenseTotal + payrollTotal;

  const incomeTotal = feeTotal + donationTotal;
  const net = incomeTotal - expenseWithSalary;

  const monthly: Array<{ month: string; income: number; expense: number; net: number }> = [];
  if (!month) {
    for (let m = 1; m <= 12; m++) {
      const key = String(m).padStart(2, "0");
      const range = monthRange(year, key);
      let inc = 0;
      let exp = 0;
      for (const d of donations) {
        if (inRange(new Date(d.date), range.start, range.end)) inc += d.amount;
      }
      for (const ledger of ledgers) {
        for (const payment of ledger.payments ?? []) {
          if (payment.date && inRange(new Date(payment.date), range.start, range.end)) inc += payment.amount;
        }
      }
      for (const e of expenses) {
        if (inRange(new Date(e.date), range.start, range.end)) exp += e.amount;
      }
      for (const slip of payrolls) {
        if (slip.paidAt && inRange(new Date(slip.paidAt), range.start, range.end)) exp += slip.net;
      }
      monthly.push({ month: `${year}-${key}`, income: inc, expense: exp, net: inc - exp });
    }
  }

  return {
    year,
    month: month ?? "",
    income: {
      total: incomeTotal,
      fees: feeTotal,
      donations: donationTotal,
      feeByMethod,
    },
    expense: {
      total: expenseWithSalary,
      operational: expenseTotal,
      payroll: payrollTotal,
      byCategory: expenseByCategory,
    },
    net,
    monthly,
  };
}
