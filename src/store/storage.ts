// 保存の規則は docs/product/spec.md の「保存」。
import { isDate } from "../lib/month";
import { findCategory } from "./categories";
import { MEMO_MAX_LENGTH, type Store, type Transaction } from "./types";

export const STORAGE_KEY = "kakeibo:v1";

export type LoadResult = { ok: true; store: Store } | { ok: false; reason: string };
export type SaveResult = { ok: true } | { ok: false; reason: string };

/** 保存先から読む。キーが無ければ空の Store を返す（保存はしない）。読めなければ理由を返し、値には触れない。 */
export function loadStore(storage: Storage): LoadResult {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return { ok: true, store: { version: 1, transactions: [] } };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "保存されたデータを JSON として読めません。" };
  }
  if (!isRecord(value) || value.version !== 1) {
    return { ok: false, reason: "保存されたデータの版が違います。" };
  }
  if (!Array.isArray(value.transactions) || !value.transactions.every(isTransaction)) {
    return { ok: false, reason: "保存されたデータの形が合いません。" };
  }
  return { ok: true, store: { version: 1, transactions: value.transactions } };
}

/** 保存先へ書く。容量超過などで書けなければ理由を返す。 */
export function saveStore(storage: Storage, store: Store): SaveResult {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(store));
    return { ok: true };
  } catch {
    return {
      ok: false,
      reason: "保存できませんでした。ブラウザの保存領域が足りない可能性があります。",
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isTransaction(value: unknown): value is Transaction {
  if (!isRecord(value)) return false;
  const { id, date, type, amount, categoryId, memo } = value;
  return (
    typeof id === "string" &&
    id !== "" &&
    typeof date === "string" &&
    isDate(date) &&
    (type === "income" || type === "expense") &&
    typeof amount === "number" &&
    Number.isSafeInteger(amount) &&
    amount >= 1 &&
    typeof categoryId === "string" &&
    findCategory(categoryId)?.type === type &&
    typeof memo === "string" &&
    memo.length <= MEMO_MAX_LENGTH
  );
}
