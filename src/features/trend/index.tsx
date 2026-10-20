// 仕様は docs/product/spec.md の「月ごとの推移」。
import type { Feature } from "../../app/features";
import { useMonth } from "../../app/month";
import { useKakeibo } from "../../store/KakeiboProvider";
import { Amount, Bar, Card } from "../../ui";
import { calculateTrend } from "./calculate";

function Trend() {
  const month = useMonth();
  const { transactions } = useKakeibo();
  const { months, max } = calculateTrend(transactions, month);

  return (
    <Card title="6 か月の推移">
      <ul className="flex flex-col gap-3">
        {months.map((row) => (
          <li key={row.month} className="flex flex-col gap-2">
            <p className="text-sm text-text-muted">{Number(row.month.slice(5))}月</p>
            {(["income", "expense"] as const).map((type) => (
              <div key={type} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span>{type === "income" ? "収入" : "支出"}</span>
                  <Amount value={row[type]} tone={type} />
                </div>
                <Bar value={row[type]} max={max} tone={type} />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export const feature: Feature = { slot: "side", order: 20, Component: Trend };
