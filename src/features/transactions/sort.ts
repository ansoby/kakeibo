import type { Month } from "../../lib/month";
import { monthOf } from "../../lib/month";
import type { Transaction } from "../../store/types";

/** 月の取引を、日付の新しい順（同じ日なら記録の新しい順）に並べる。 */
export function transactionsOfMonth(
  transactions: readonly Transaction[],
  month: Month,
): Transaction[] {
  // 取引は記録した順に保存されているため、後ろほど新しい。
  return transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => monthOf(transaction.date) === month)
    .sort((a, b) =>
      a.transaction.date === b.transaction.date
        ? b.index - a.index
        : b.transaction.date.localeCompare(a.transaction.date),
    )
    .map(({ transaction }) => transaction);
}
