// 画面が読み書きする唯一の入口。画面は localStorage を直接触らない（docs/product/spec.md の「保存」）。
import { isTransaction, loadStore, type SaveResult, saveStore } from "./storage";
import type { NewTransaction, Store, Transaction } from "./types";

export type Snapshot =
  | { status: "ready"; transactions: readonly Transaction[] }
  | { status: "broken"; reason: string };

export type KakeiboStore = {
  getSnapshot(): Snapshot;
  subscribe(listener: () => void): () => void;
  addTransaction(input: NewTransaction): SaveResult;
};

export function createKakeiboStore(storage: Storage): KakeiboStore {
  const loaded = loadStore(storage);
  let snapshot: Snapshot = loaded.ok
    ? { status: "ready", transactions: loaded.store.transactions }
    : { status: "broken", reason: loaded.reason };
  const listeners = new Set<() => void>();

  // 保存に成功したときだけ画面の状態を進める。失敗したら変更前のままにする。
  function commit(transactions: Transaction[]): SaveResult {
    const store: Store = { version: 1, transactions };
    const saved = saveStore(storage, store);
    if (!saved.ok) return saved;
    snapshot = { status: "ready", transactions };
    for (const listener of listeners) listener();
    return saved;
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    addTransaction(input) {
      if (snapshot.status === "broken") {
        return { ok: false, reason: "保存されたデータを読めないため、記録できません。" };
      }
      const transaction = { ...input, id: crypto.randomUUID() };
      if (!isTransaction(transaction))
        return { ok: false, reason: "記録の内容が正しくありません。" };
      return commit([...snapshot.transactions, transaction]);
    },
  };
}
