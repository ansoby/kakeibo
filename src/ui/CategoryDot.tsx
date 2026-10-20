import { BG_CLASS, type Tone } from "./colors";

/** カテゴリなどの色を示す小さな丸。 */
export function CategoryDot({ tone }: { tone: Tone }) {
  return (
    <span aria-hidden className={`inline-block size-2.5 shrink-0 rounded-full ${BG_CLASS[tone]}`} />
  );
}
