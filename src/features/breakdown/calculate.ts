import { type Month, monthOf } from "../../lib/month";
import { type Category, categoriesOf } from "../../store/categories";
import type { Transaction } from "../../store/types";

export type BreakdownRow = {
  category: Category;
  amount: number;
  percentage: number;
};

export type Breakdown = {
  rows: BreakdownRow[];
  maxAmount: number;
};

/** 表示月の支出を合算し、金額降順・同額ならカテゴリ定義順に並べる。 */
export function calculateBreakdown(transactions: readonly Transaction[], month: Month): Breakdown {
  const amounts = new Map<string, number>();
  let totalExpense = 0;
  for (const transaction of transactions) {
    if (transaction.type !== "expense" || monthOf(transaction.date) !== month) continue;
    amounts.set(
      transaction.categoryId,
      (amounts.get(transaction.categoryId) ?? 0) + transaction.amount,
    );
    totalExpense += transaction.amount;
  }
  if (totalExpense === 0) return { rows: [], maxAmount: 0 };

  // 安定ソートにより、同額のカテゴリは categoriesOf の定義順を保つ。
  const rows = categoriesOf("expense")
    .map((category) => {
      const amount = amounts.get(category.id) ?? 0;
      return { category, amount, percentage: Math.round((amount * 100) / totalExpense) };
    })
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  return { rows, maxAmount: rows[0]?.amount ?? 0 };
}
