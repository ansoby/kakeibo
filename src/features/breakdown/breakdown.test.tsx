import { act, fireEvent, screen, within } from "@testing-library/react";
import { setMonth } from "../../app/month";
import { renderApp, transaction } from "../../test-utils";

const region = () => within(screen.getByRole("region", { name: "支出の内訳" }));

describe("支出の内訳", () => {
  it("金額降順・同額ならカテゴリ順に、金額・割合・カテゴリ色・最大値基準の横棒を表示する", () => {
    renderApp({
      month: "2026-09",
      transactions: [
        transaction({ categoryId: "fun", amount: 1500 }),
        transaction({ categoryId: "daily", amount: 1500 }),
        transaction({ amount: 3000 }),
        transaction({ type: "income", categoryId: "salary", amount: 9000 }),
        transaction({ date: "2026-08-01", categoryId: "housing", amount: 9000 }),
      ],
    });
    const rows = region().getAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual([
      "食費3,000円50%",
      "日用品1,500円25%",
      "娯楽1,500円25%",
    ]);
    rows.forEach((row, index) => {
      const bar = row.querySelector<HTMLElement>("[aria-hidden] > div");
      expect(bar?.style.width).toBe(index === 0 ? "100%" : "50%");
      const color = ["bg-cat-1", "bg-cat-2", "bg-cat-6"][index];
      expect(bar?.classList.contains(color as string)).toBe(true);
      expect(row.querySelector("span[aria-hidden]")?.classList.contains(color as string)).toBe(
        true,
      );
    });
  });

  it("四捨五入した割合を表示する", () => {
    renderApp({
      month: "2026-09",
      transactions: [
        transaction({ amount: 124 }),
        transaction({ categoryId: "daily", amount: 125 }),
        transaction({ categoryId: "fun", amount: 751 }),
      ],
    });
    expect(
      region()
        .getAllByRole("listitem")
        .map((row) => row.textContent),
    ).toEqual(["娯楽751円75%", "日用品125円13%", "食費124円12%"]);
  });

  it("月の変更に追従し、収入のみの月は空表示にする", () => {
    renderApp({
      month: "2026-09",
      transactions: [
        transaction(),
        transaction({ date: "2026-08-01", type: "income", categoryId: "salary" }),
      ],
    });
    expect(region().getByText("1,000円")).toBeDefined();
    act(() => setMonth("2026-08"));
    expect(region().getByText("この月の支出はまだありません")).toBeDefined();
    expect(region().queryByRole("list")).toBeNull();
    act(() => setMonth("2026-07"));
    expect(region().getByText("この月の支出はまだありません")).toBeDefined();
  });

  it("支出の登録後すぐに更新し、再表示しても保存済みデータから集計する", async () => {
    const app = renderApp({ month: "2026-09", transactions: [] });
    expect(region().getByText("この月の支出はまだありません")).toBeDefined();
    await app.user.click(screen.getByRole("button", { name: "収支を記録" }));
    fireEvent.change(screen.getByLabelText("日付"), { target: { value: "2026-09-05" } });
    await app.user.type(screen.getByLabelText("金額"), "1200");
    await app.user.click(screen.getByRole("button", { name: "記録" }));
    expect(
      region()
        .getAllByRole("listitem")
        .map((row) => row.textContent),
    ).toEqual(["食費1,200円100%"]);
    app.unmount();
    renderApp({ month: "2026-09" });
    expect(region().getByText("1,200円")).toBeDefined();
  });
});
