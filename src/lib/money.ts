// 金額は円の整数だけを扱い、浮動小数で計算しない（docs/product/spec.md の「データ」）。

const GROUPED = /^\d{1,3}(,\d{3})+$/;
const PLAIN = /^\d+$/;

/** 入力の文字列を金額にする（収支の登録で使う）。1 以上の整数でなければ null。`1,200` のようなカンマ区切りも受ける。 */
export function parseAmount(input: string): number | null {
  const text = input.trim();
  if (!PLAIN.test(text) && !GROUPED.test(text)) return null;
  const value = Number(text.replaceAll(",", ""));
  if (!Number.isSafeInteger(value) || value < 1) return null;
  return value;
}

/** 金額を `1,200円` の形にする。負の数は `-1,200円`。 */
export function formatYen(amount: number): string {
  return `${amount.toLocaleString("ja-JP")}円`;
}
