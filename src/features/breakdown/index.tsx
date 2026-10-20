// 仕様は docs/product/spec.md の「カテゴリ別の内訳」。
import type { Feature } from "../../app/features";
import { useMonth } from "../../app/month";
import { useKakeibo } from "../../store/KakeiboProvider";
import { Amount, Bar, Card, CategoryDot } from "../../ui";
import { calculateBreakdown } from "./calculate";

function ExpenseBreakdown() {
  const month = useMonth();
  const { transactions } = useKakeibo();
  const { rows, maxAmount } = calculateBreakdown(transactions, month);

  return (
    <Card title="支出の内訳">
      {rows.length === 0 ? (
        <p className="py-8 text-center text-text-muted">この月の支出はまだありません</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map(({ category, amount, percentage }) => (
            <li key={category.id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-2">
                  <CategoryDot tone={category.color} />
                  {category.name}
                </span>
                <Amount value={amount} className="ml-auto" />
                <span className="text-sm text-text-muted tabular-nums">{percentage}%</span>
              </div>
              <Bar value={amount} max={maxAmount} tone={category.color} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export const feature: Feature = { slot: "side", order: 10, Component: ExpenseBreakdown };
