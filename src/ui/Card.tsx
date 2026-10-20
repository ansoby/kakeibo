import { type ReactNode, useId } from "react";

type Props = {
  title: string;
  /** 見出しの右に置くもの（ボタンなど）。 */
  action?: ReactNode;
  children: ReactNode;
};

/** 画面の 1 つの区画。見出しを持ち、見出しの名前で区画を指せる（role="region"）。 */
export function Card({ title, action, children }: Props) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="rounded-lg border border-border bg-surface p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 id={id} className="font-bold">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
