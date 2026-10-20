import { addMonths, type Month, monthOf } from "../../lib/month";
import type { Transaction } from "../../store/types";

type MonthlyTotal = {
  month: Month;
  income: number;
  expense: number;
};

type TrendData = {
  months: MonthlyTotal[];
  max: number;
};

/** 表示中の月までの6か月を集計し、収入・支出に共通の横棒の基準を返す。 */
export function calculateTrend(transactions: readonly Transaction[], month: Month): TrendData {
  const months = Array.from({ length: 6 }, (_, index) => ({
    month: addMonths(month, index - 5),
    income: 0,
    expense: 0,
  }));
  const byMonth = new Map(months.map((row) => [row.month, row]));
  for (const transaction of transactions) {
    const row = byMonth.get(monthOf(transaction.date));
    if (row) row[transaction.type] += transaction.amount;
  }
  return { months, max: Math.max(0, ...months.flatMap((row) => [row.income, row.expense])) };
}
