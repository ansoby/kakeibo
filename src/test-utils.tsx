// テストでアプリ全体を描く。保存先は本物の localStorage（happy-dom のもの）を使い、自分のモジュールをモックしない。
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./app/App";
import { KakeiboProvider } from "./store/KakeiboProvider";
import { createKakeiboStore } from "./store/kakeibo";
import { STORAGE_KEY } from "./store/storage";
import type { Transaction } from "./store/types";

type Options = {
  /** 保存済みにしておく取引。 */
  transactions?: Transaction[];
  /** 表示中の月（URL の `?month=`）。 */
  month?: string;
};

export function renderApp({ transactions, month }: Options = {}) {
  if (transactions !== undefined) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, transactions }));
  }
  if (month !== undefined) window.history.replaceState(null, "", `/?month=${month}`);
  const user = userEvent.setup();
  const result = render(
    <KakeiboProvider store={createKakeiboStore(localStorage)}>
      <App />
    </KakeiboProvider>,
  );
  return { user, ...result };
}

let seq = 0;

/** テスト用の取引。指定しなかった項目は支出の食費で埋める。 */
export function transaction(fields: Partial<Transaction> = {}): Transaction {
  seq += 1;
  return {
    id: `t${seq}`,
    date: "2026-09-05",
    type: "expense",
    amount: 1000,
    categoryId: "food",
    memo: "",
    ...fields,
  };
}
