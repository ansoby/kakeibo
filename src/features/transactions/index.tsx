// 仕様は docs/product/spec.md の「取引の一覧」。
import type { Feature } from "../../app/features";
import { useMonth } from "../../app/month";
import { formatDay } from "../../lib/month";
import { findCategory } from "../../store/categories";
import { useKakeibo } from "../../store/KakeiboProvider";
import { Amount, Card, CategoryDot } from "../../ui";
import { transactionsOfMonth } from "./sort";

function TransactionList() {
  const month = useMonth();
  const { transactions } = useKakeibo();
  const rows = transactionsOfMonth(transactions, month);

  return (
    <Card title="取引">
      {rows.length === 0 ? (
        <p className="py-8 text-center text-text-muted">この月の取引はまだありません。</p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((t) => {
            const category = findCategory(t.categoryId);
            return (
              <li key={t.id} className="flex items-center gap-3 py-2">
                <span className="w-12 shrink-0 text-sm text-text-muted tabular-nums">
                  {formatDay(t.date)}
                </span>
                <span className="flex w-24 shrink-0 items-center gap-2">
                  {category && <CategoryDot tone={category.color} />}
                  {category?.name}
                </span>
                <span className="min-w-0 flex-1 truncate text-text-muted">{t.memo}</span>
                <Amount value={t.amount} tone={t.type} className="shrink-0" />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export const feature: Feature = { slot: "main", order: 100, Component: TransactionList };
