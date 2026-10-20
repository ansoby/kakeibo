import { BG_CLASS, type Tone } from "./colors";

type Props = {
  value: number;
  /** 棒の長さの基準。value が max のとき棒がいっぱいになる。 */
  max: number;
  tone: Tone;
};

/**
 * 横棒。グラフはこの部品を並べて描く。
 * 飾りとして読み上げから外すため、数値は棒の隣に文字でも出す。
 */
export function Bar({ value, max, tone }: Props) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  return (
    <div aria-hidden className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
      {/* 長さは値で決まるため、style を使うのはこの部品だけにする。 */}
      <div
        className={`h-full rounded-full ${BG_CLASS[tone]}`}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
