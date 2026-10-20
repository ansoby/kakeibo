// 表示中の月は URL のクエリ `?month=YYYY-MM` に持つ（docs/product/spec.md の「表示中の月」）。
import { useSyncExternalStore } from "react";
import { currentMonth, isMonth, type Month } from "../lib/month";

const listeners = new Set<() => void>();

function read(): Month {
  const value = new URLSearchParams(window.location.search).get("month");
  return value !== null && isMonth(value) ? value : currentMonth();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

/** 表示中の月。クエリが無いか正しくなければ今月。 */
export function useMonth(): Month {
  return useSyncExternalStore(subscribe, read);
}

/** 表示中の月を変え、ブラウザの履歴に積む。 */
export function setMonth(month: Month): void {
  const url = new URL(window.location.href);
  url.searchParams.set("month", month);
  window.history.pushState(null, "", url);
  for (const listener of listeners) listener();
}
