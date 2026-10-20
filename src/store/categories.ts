// カテゴリは固定で、利用者は増やせない（docs/product/spec.md の「カテゴリ」）。
import type { TransactionType } from "./types";

/** カテゴリの色。デザイントークンの名前を持ち、色の値は持たない（ダークで値が変わるため）。 */
export type CategoryColor = "cat-1" | "cat-2" | "cat-3" | "cat-4" | "cat-5" | "cat-6" | "cat-7";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  color: CategoryColor;
};

export const CATEGORIES: readonly Category[] = [
  { id: "food", name: "食費", type: "expense", color: "cat-1" },
  { id: "daily", name: "日用品", type: "expense", color: "cat-2" },
  { id: "housing", name: "住居", type: "expense", color: "cat-3" },
  { id: "utilities", name: "光熱費", type: "expense", color: "cat-4" },
  { id: "transport", name: "交通", type: "expense", color: "cat-5" },
  { id: "fun", name: "娯楽", type: "expense", color: "cat-6" },
  { id: "other-expense", name: "その他", type: "expense", color: "cat-7" },
  { id: "salary", name: "給与", type: "income", color: "cat-3" },
  { id: "other-income", name: "その他", type: "income", color: "cat-7" },
];

export function categoriesOf(type: TransactionType): Category[] {
  return CATEGORIES.filter((c) => c.type === type);
}

/** id のカテゴリ。保存の層が形を確かめているため、画面では必ず見つかる。 */
export function findCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
