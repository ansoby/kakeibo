// 仕様は docs/product/spec.md の「CSV の書き出し」。
import type { Feature } from "../../app/features";
import { useMonth } from "../../app/month";
import { useKakeibo } from "../../store/KakeiboProvider";
import { Button } from "../../ui";
import { transactionsOfMonth } from "../transactions/sort";
import { createCsv, csvFilename } from "./csv";

function ExportCsv() {
  const month = useMonth();
  const { transactions } = useKakeibo();
  const rows = transactionsOfMonth(transactions, month);

  function download() {
    if (rows.length === 0) return;
    const blob = new Blob([createCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = csvFilename(month);
    document.body.append(link);
    try {
      link.click();
    } finally {
      link.remove();
      // ブラウザがダウンロードを開始してから URL を解放する。
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  }

  return (
    <Button disabled={rows.length === 0} onClick={download}>
      CSV
    </Button>
  );
}

export const feature: Feature = { slot: "header", order: 50, Component: ExportCsv };
