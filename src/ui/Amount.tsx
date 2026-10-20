import { formatYen } from "../lib/money";

type Props = {
  value: number;
  /**
   * 色。
   * - income / expense: 収入・支出の色
   * - sign: 正なら収入、負なら支出の色、0 なら色なし（差額に使う）
   * - plain: 色なし
   */
  tone?: "income" | "expense" | "sign" | "plain";
  className?: string;
};

const TONE_CLASS = { income: "text-income", expense: "text-expense", plain: "" } as const;

/** 金額を `1,200円` の形で、桁をそろえて出す。 */
export function Amount({ value, tone = "plain", className }: Props) {
  const resolved =
    tone === "sign" ? (value > 0 ? "income" : value < 0 ? "expense" : "plain") : tone;
  return (
    <span className={`tabular-nums ${TONE_CLASS[resolved]} ${className ?? ""}`}>
      {formatYen(value)}
    </span>
  );
}
