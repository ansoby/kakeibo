import { type ReactNode, useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  /** Esc やボタンで閉じたとき。 */
  onClose: () => void;
  children: ReactNode;
};

/** モーダルのダイアログ。開いている間だけ中身を描く。 */
export function Dialog({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog === null) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={onClose}
      className="m-auto w-full max-w-md rounded-lg border border-border bg-surface p-0 text-text shadow-xl backdrop:bg-text/40"
    >
      {open && (
        <div className="p-5">
          <h2 id={id} className="mb-4 text-lg font-bold">
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
