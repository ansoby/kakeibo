// 月は "YYYY-MM"、日付は "YYYY-MM-DD" の文字列で表す。Date の比較でなく文字列の先頭で月を決め、
// タイムゾーンで月がずれないようにする（docs/product/spec.md の「データ」）。

/** "YYYY-MM" の形の月。 */
export type Month = string;

const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;
const DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function isMonth(value: string): value is Month {
  return MONTH.test(value);
}

/** "YYYY-MM-DD" の形で、暦に実在する日付か。 */
export function isDate(value: string): boolean {
  if (!DATE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number) as [number, number, number];
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

/** 端末の日付で今日を "YYYY-MM-DD" にする。 */
export function today(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 端末の日付で今月を "YYYY-MM" にする。 */
export function currentMonth(now: Date = new Date()): Month {
  return monthOf(today(now));
}

/** 日付 "YYYY-MM-DD" が属する月。 */
export function monthOf(date: string): Month {
  return date.slice(0, 7);
}

/** 月を n か月ずらす（負なら前へ）。 */
export function addMonths(month: Month, n: number): Month {
  const [y, m] = month.split("-").map(Number) as [number, number];
  const index = y * 12 + (m - 1) + n;
  const year = Math.floor(index / 12);
  const mon = (index % 12) + 1;
  return `${String(year).padStart(4, "0")}-${String(mon).padStart(2, "0")}`;
}

/** "2026-09" を "2026年9月" にする。 */
export function formatMonth(month: Month): string {
  const [y, m] = month.split("-").map(Number) as [number, number];
  return `${y}年${m}月`;
}

/** "2026-09-05" を "9/5" にする。 */
export function formatDay(date: string): string {
  const [, m, d] = date.split("-").map(Number) as [number, number, number];
  return `${m}/${d}`;
}
