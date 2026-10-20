// 仕様は docs/product/spec.md の「収支の登録」。
import { useState } from "react";
import type { Feature } from "../../app/features";
import { parseAmount } from "../../lib/money";
import { isDate, today } from "../../lib/month";
import { categoriesOf } from "../../store/categories";
import { useKakeibo } from "../../store/KakeiboProvider";
import { MEMO_MAX_LENGTH, type TransactionType } from "../../store/types";
import { Button, Dialog, Field, Input, Select } from "../../ui";

function RegisterForm({ onClose }: { onClose: () => void }) {
  const { addTransaction } = useKakeibo();
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(today);
  const [amountText, setAmountText] = useState("");
  const [amountEdited, setAmountEdited] = useState(false);
  const [categoryId, setCategoryId] = useState(categoriesOf("expense")[0]?.id ?? "");
  const [memo, setMemo] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const categories = categoriesOf(type);
  const amount = parseAmount(amountText);
  const dateError = isDate(date) ? null : "正しい日付を入力してください。";
  const amountError = amount === null ? "金額は1以上の整数で入力してください。" : null;
  const categoryError = categories.some((category) => category.id === categoryId)
    ? null
    : "収支に合うカテゴリを選択してください。";
  const memoError =
    memo.length > MEMO_MAX_LENGTH ? `メモは${MEMO_MAX_LENGTH}文字以内で入力してください。` : null;
  const invalid =
    amount === null || dateError !== null || categoryError !== null || memoError !== null;

  return (
    <form
      noValidate
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (invalid || amount === null) return;
        const result = addTransaction({ type, date, amount, categoryId, memo });
        if (result.ok) onClose();
        else setSaveError(result.reason);
      }}
    >
      <Field label="収支">
        {(control) => (
          <Select
            {...control}
            value={type}
            onChange={(event) => {
              const next = event.target.value === "income" ? "income" : "expense";
              setType(next);
              setCategoryId(categoriesOf(next)[0]?.id ?? "");
            }}
          >
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </Select>
        )}
      </Field>
      <Field label="日付" error={dateError}>
        {(control) => (
          <Input
            {...control}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        )}
      </Field>
      <Field label="金額" error={amountEdited ? amountError : null}>
        {(control) => (
          <Input
            {...control}
            type="text"
            inputMode="numeric"
            value={amountText}
            onChange={(event) => {
              setAmountText(event.target.value);
              setAmountEdited(true);
            }}
          />
        )}
      </Field>
      <Field label="カテゴリ" error={categoryError}>
        {(control) => (
          <Select
            {...control}
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="メモ" error={memoError}>
        {(control) => (
          <Input {...control} value={memo} onChange={(event) => setMemo(event.target.value)} />
        )}
      </Field>
      {saveError !== null && (
        <p role="alert" className="text-sm text-danger">
          {saveError}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>キャンセル</Button>
        <Button type="submit" variant="primary" disabled={invalid}>
          記録
        </Button>
      </div>
    </form>
  );
}

function Register() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>収支を記録</Button>
      <Dialog open={open} title="収支の登録" onClose={() => setOpen(false)}>
        <RegisterForm onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
}

export const feature: Feature = { slot: "header", order: 100, Component: Register };
