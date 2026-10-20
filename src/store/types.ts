// データの形の SSoT は docs/product/spec.md の「データ」。変えるときは先に仕様を直す。

export type TransactionType = "income" | "expense";

export type Transaction = {
  /** crypto.randomUUID() */
  id: string;
  /** "YYYY-MM-DD"（利用者の端末の日付） */
  date: string;
  type: TransactionType;
  /** 円。1 以上の整数 */
  amount: number;
  /** categories.ts の Category.id。type が同じカテゴリだけ */
  categoryId: string;
  /** 空でもよい。100 文字まで */
  memo: string;
};

export type NewTransaction = Omit<Transaction, "id">;

export type Store = {
  version: 1;
  transactions: Transaction[];
};

export const MEMO_MAX_LENGTH = 100;
