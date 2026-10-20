import type { ComponentProps } from "react";

const VARIANT_CLASS = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  secondary: "border border-border bg-surface text-text hover:bg-surface-muted",
  danger: "bg-danger text-on-primary hover:opacity-90",
  ghost: "text-text-muted hover:bg-surface-muted hover:text-text",
} as const;

type Props = ComponentProps<"button"> & { variant?: keyof typeof VARIANT_CLASS };

/** ボタン。type の既定は "button"（フォームを意図せず送らない）。 */
export function Button({ variant = "secondary", type = "button", className, ...props }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
