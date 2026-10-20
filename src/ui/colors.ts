// Tailwind は書かれたクラス名だけを生成するため、色の名前からクラスへの対応をここに書き切る。
import type { CategoryColor } from "../store/categories";

/** 色の名前。カテゴリの色に加え、収入と支出の色を選べる。 */
export type Tone = CategoryColor | "income" | "expense";

export const BG_CLASS: Record<Tone, string> = {
  "cat-1": "bg-cat-1",
  "cat-2": "bg-cat-2",
  "cat-3": "bg-cat-3",
  "cat-4": "bg-cat-4",
  "cat-5": "bg-cat-5",
  "cat-6": "bg-cat-6",
  "cat-7": "bg-cat-7",
  income: "bg-income",
  expense: "bg-expense",
};
