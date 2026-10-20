import { createContext, type ReactNode, useContext, useSyncExternalStore } from "react";
import type { KakeiboStore } from "./kakeibo";
import type { Transaction } from "./types";

const KakeiboContext = createContext<KakeiboStore | null>(null);

export function KakeiboProvider({ store, children }: { store: KakeiboStore; children: ReactNode }) {
  return <KakeiboContext value={store}>{children}</KakeiboContext>;
}

export type Kakeibo = {
  /** すべての取引。保存されたデータを読めないときは空。 */
  transactions: readonly Transaction[];
  /** 保存されたデータを読めないときの理由。読めていれば null。 */
  loadError: string | null;
  addTransaction: KakeiboStore["addTransaction"];
};

export function useKakeibo(): Kakeibo {
  const store = useContext(KakeiboContext);
  if (store === null) throw new Error("useKakeibo は KakeiboProvider の中で使う");
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return snapshot.status === "ready"
    ? { transactions: snapshot.transactions, loadError: null, addTransaction: store.addTransaction }
    : { transactions: [], loadError: snapshot.reason, addTransaction: store.addTransaction };
}
