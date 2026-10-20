import { createKakeiboStore } from "./kakeibo";
import { STORAGE_KEY } from "./storage";
import type { NewTransaction } from "./types";

const lunch: NewTransaction = {
  date: "2026-09-05",
  type: "expense",
  amount: 1200,
  categoryId: "food",
  memo: "ランチ",
};

describe("createKakeiboStore", () => {
  it("初めて開いたときは空で始め、まだ保存しない", () => {
    const store = createKakeiboStore(localStorage);
    expect(store.getSnapshot()).toEqual({ status: "ready", transactions: [] });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("記録を保存し、読み直しても残る", () => {
    const store = createKakeiboStore(localStorage);
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.addTransaction(lunch)).toEqual({ ok: true });
    expect(listener).toHaveBeenCalledTimes(1);

    const reloaded = createKakeiboStore(localStorage).getSnapshot();
    expect(reloaded.status === "ready" && reloaded.transactions).toEqual([
      { ...lunch, id: expect.any(String) },
    ]);
  });

  it("type と合わないカテゴリの記録を受けない", () => {
    const store = createKakeiboStore(localStorage);
    const result = store.addTransaction({ ...lunch, categoryId: "salary" });
    expect(result.ok).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it.each([
    ["JSON でない", "{"],
    ["版が違う", JSON.stringify({ version: 2, transactions: [] })],
    ["形が合わない", JSON.stringify({ version: 1, transactions: [{ id: "x" }] })],
  ])("%s値は上書きせず、読めない理由を出す", (_, raw) => {
    localStorage.setItem(STORAGE_KEY, raw);
    const store = createKakeiboStore(localStorage);

    expect(store.getSnapshot().status).toBe("broken");
    expect(store.addTransaction(lunch).ok).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });

  it("保存に失敗したら変更前のままにする", () => {
    // 容量超過はブラウザの外の境界のため、書き込みだけ失敗させる。
    const full: Storage = {
      ...localStorage,
      getItem: (key) => localStorage.getItem(key),
      setItem: () => {
        throw new DOMException("quota", "QuotaExceededError");
      },
    };
    const store = createKakeiboStore(full);
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.addTransaction(lunch).ok).toBe(false);
    expect(store.getSnapshot()).toEqual({ status: "ready", transactions: [] });
    expect(listener).not.toHaveBeenCalled();
  });
});
