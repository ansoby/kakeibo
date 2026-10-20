import { type ComponentProps, type ReactNode, useId } from "react";

export type ControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
};

type Props = {
  label: string;
  /** 入力の誤りの理由。誤りが無ければ null か undefined。 */
  error?: string | null;
  /** 入力の部品を描く。受け取った値をそのまま部品に渡すと、ラベルと誤りが結び付く。 */
  children: (control: ControlProps) => ReactNode;
};

/** ラベル・入力・誤りの理由を縦に並べる。 */
export function Field({ label, error, children }: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  const hasError = error !== null && error !== undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": hasError,
        "aria-describedby": hasError ? errorId : undefined,
      })}
      {hasError && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const CONTROL_CLASS =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-primary aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={`${CONTROL_CLASS} ${className ?? ""}`} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={`${CONTROL_CLASS} ${className ?? ""}`} {...props} />;
}
