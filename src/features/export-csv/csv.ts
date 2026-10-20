import type { Month } from "../../lib/month";
import { findCategory } from "../../store/categories";
import type { Transaction } from "../../store/types";

function escapeField(value: string): string {
  return /[,\r\n"]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

/** 一覧順の取引を、BOM 付き UTF-8 用の CSV 文字列にする。 */
export function createCsv(transactions: readonly Transaction[]): string {
  const rows = transactions.map((transaction) => {
    const category = findCategory(transaction.categoryId);
    if (category === undefined) throw new Error("取引のカテゴリが見つかりません。");
    return [
      transaction.date,
      transaction.type === "income" ? "収入" : "支出",
      category.name,
      String(transaction.amount),
      transaction.memo,
    ]
      .map(escapeField)
      .join(",");
  });
  return `\uFEFF${["日付,収支,カテゴリ,金額,メモ", ...rows].join("\r\n")}\r\n`;
}

export function csvFilename(month: Month): string {
  return `kakeibo-${month}.csv`;
}
