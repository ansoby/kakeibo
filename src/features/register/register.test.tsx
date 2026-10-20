import { fireEvent, screen, within } from "@testing-library/react";
import { today } from "../../lib/month";
import { STORAGE_KEY } from "../../store/storage";
import { renderApp, transaction } from "../../test-utils";

const submit = () => screen.getByRole<HTMLButtonElement>("button", { name: "記録" });
const amountInput = () => screen.getByLabelText<HTMLInputElement>("金額");
const categoryInput = () => screen.getByLabelText<HTMLSelectElement>("カテゴリ");

async function openForm() {
  const app = renderApp({ month: "2026-09" });
  await app.user.click(screen.getByRole("button", { name: "収支を記録" }));
  return app;
}

describe("収支の登録", () => {
  it("支出・今日・先頭カテゴリで開き、金額の入力前には理由を出さない", async () => {
    await openForm();
    expect(screen.getByRole("dialog", { name: "収支の登録" })).toBeDefined();
    expect(screen.getByLabelText<HTMLSelectElement>("収支").value).toBe("expense");
    expect(screen.getByLabelText<HTMLInputElement>("日付").value).toBe(today());
    expect(categoryInput().value).toBe("food");
    expect(amountInput().value).toBe("");
    expect(amountInput().getAttribute("aria-invalid")).toBe("false");
    expect(submit().disabled).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("収支を切り替えるとカテゴリ候補と先頭の選択に切り替わる", async () => {
    const { user } = await openForm();
    await user.selectOptions(categoryInput(), "fun");
    await user.selectOptions(screen.getByLabelText("収支"), "income");
    expect(categoryInput().value).toBe("salary");
    expect(Array.from(categoryInput().options, (option) => option.value)).toEqual([
      "salary",
      "other-income",
    ]);
    await user.selectOptions(categoryInput(), "other-income");
    await user.selectOptions(screen.getByLabelText("収支"), "expense");
    expect(categoryInput().value).toBe("food");
    expect(Array.from(categoryInput().options, (option) => option.value)).toEqual([
      "food",
      "daily",
      "housing",
      "utilities",
      "transport",
      "fun",
      "other-expense",
    ]);
  });

  it.each([
    ["expense", "food", "食費"],
    ["income", "salary", "給与"],
  ])(
    "%sを記録し、一覧と保存先に反映して再表示しても残る",
    async (type, categoryId, categoryName) => {
      const app = await openForm();
      await app.user.selectOptions(screen.getByLabelText("収支"), type);
      fireEvent.change(screen.getByLabelText("日付"), { target: { value: "2026-09-05" } });
      await app.user.type(amountInput(), "1,200");
      await app.user.type(screen.getByLabelText("メモ"), "登録テスト");
      await app.user.click(submit());
      expect(screen.queryByRole("dialog")).toBeNull();
      const expected = {
        id: expect.any(String),
        type,
        categoryId,
        date: "2026-09-05",
        amount: 1200,
        memo: "登録テスト",
      };
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual({
        version: 1,
        transactions: [expected],
      });
      const list = within(screen.getByRole("region", { name: "取引" }));
      expect(list.getByText(categoryName)).toBeDefined();
      expect(list.getByText("1,200円")).toBeDefined();
      app.unmount();
      renderApp({ month: "2026-09" });
      expect(screen.getByText("登録テスト")).toBeDefined();
      expect(
        within(screen.getByRole("region", { name: "取引" })).getByText("1,200円"),
      ).toBeDefined();
    },
  );

  it.each(["0", "-1", "1.5", "12,00", "abc", "99999999999999999"])(
    "金額%sでは理由を結び付けて記録を禁止し、修正で解除する",
    async (input) => {
      const { user } = await openForm();
      await user.type(amountInput(), input);
      expect(submit().disabled).toBe(true);
      expect(amountInput().getAttribute("aria-invalid")).toBe("true");
      const errorId = amountInput().getAttribute("aria-describedby") ?? "";
      expect(document.getElementById(errorId)?.textContent).toMatch(/1以上の整数/);
      fireEvent.submit(submit().closest("form") as HTMLFormElement);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      await user.clear(amountInput());
      expect(submit().disabled).toBe(true);
      await user.type(amountInput(), "1");
      expect(submit().disabled).toBe(false);
      expect(amountInput().getAttribute("aria-invalid")).toBe("false");
    },
  );

  it("空の日付と101文字のメモを拒否し、日付と100文字のメモへの修正で記録できる", async () => {
    const { user } = await openForm();
    await user.type(amountInput(), "1");
    fireEvent.change(screen.getByLabelText("日付"), { target: { value: "" } });
    expect(submit().disabled).toBe(true);
    expect(screen.getByText("正しい日付を入力してください。")).toBeDefined();
    fireEvent.change(screen.getByLabelText("日付"), { target: { value: "2026-09-05" } });
    fireEvent.change(screen.getByLabelText("メモ"), { target: { value: "あ".repeat(101) } });
    expect(submit().disabled).toBe(true);
    expect(screen.getByText("メモは100文字以内で入力してください。")).toBeDefined();
    fireEvent.change(screen.getByLabelText("メモ"), { target: { value: "あ".repeat(100) } });
    expect(submit().disabled).toBe(false);
    await user.click(submit());
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null").transactions[0].memo,
    ).toHaveLength(100);
  });

  it("キャンセルして開き直すと入力を初期化する", async () => {
    const { user } = await openForm();
    await user.selectOptions(screen.getByLabelText("収支"), "income");
    await user.type(amountInput(), "10");
    await user.type(screen.getByLabelText("メモ"), "キャンセル");
    await user.click(screen.getByRole("button", { name: "キャンセル" }));
    await user.click(screen.getByRole("button", { name: "収支を記録" }));
    expect(screen.getByLabelText<HTMLSelectElement>("収支").value).toBe("expense");
    expect(categoryInput().value).toBe("food");
    expect(amountInput().value).toBe("");
    expect(screen.getByLabelText<HTMLInputElement>("メモ").value).toBe("");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("容量超過なら理由と入力を残し、一覧と保存済みデータは変更しない。再試行で記録できる", async () => {
    const saved = transaction({ memo: "既存" });
    const app = renderApp({ month: "2026-09", transactions: [saved] });
    const raw = localStorage.getItem(STORAGE_KEY);
    await app.user.click(screen.getByRole("button", { name: "収支を記録" }));
    fireEvent.change(screen.getByLabelText("日付"), { target: { value: "2026-09-05" } });
    await app.user.type(amountInput(), "1200");
    await app.user.type(screen.getByLabelText("メモ"), "再試行");
    const write = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });
    try {
      await app.user.click(submit());
      expect(within(screen.getByRole("dialog")).getByRole("alert").textContent).toMatch(
        /保存できませんでした/,
      );
      expect(amountInput().value).toBe("1200");
      expect(screen.getByLabelText<HTMLInputElement>("メモ").value).toBe("再試行");
      expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
      expect(
        within(screen.getByRole("region", { name: "取引" })).getAllByRole("listitem"),
      ).toHaveLength(1);
    } finally {
      write.mockRestore();
    }
    await app.user.click(submit());
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("再試行")).toBeDefined();
  });

  it("破損した保存データを上書きせず、登録できない理由をダイアログに出す", async () => {
    localStorage.setItem(STORAGE_KEY, "{");
    const { user } = await openForm();
    await user.type(amountInput(), "1");
    await user.click(submit());
    expect(within(screen.getByRole("dialog")).getByRole("alert").textContent).toMatch(
      /保存されたデータを読めない/,
    );
    expect(localStorage.getItem(STORAGE_KEY)).toBe("{");
  });
});
