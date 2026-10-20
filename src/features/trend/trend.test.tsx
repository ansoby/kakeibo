import { act, fireEvent, screen, within } from "@testing-library/react";
import { setMonth } from "../../app/month";
import { renderApp, transaction } from "../../test-utils";

function rows() {
  return within(screen.getByRole("region", { name: "6 か月の推移" })).getAllByRole("listitem");
}

describe("月ごとの推移", () => {
  it("前月の記録と空の月を含む6か月を古い順に表示する", () => {
    renderApp({
      month: "2026-09",
      transactions: [
        transaction({ date: "2026-08-31", amount: 1200 }),
        transaction({ date: "2026-08-01", type: "income", categoryId: "salary", amount: 2400 }),
      ],
    });
    expect(rows().map((row) => within(row).getByText(/^\d+月$/).textContent)).toEqual([
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
    ]);
    const august = within(rows()[4] as HTMLElement);
    expect(august.getByText("収入")).toBeDefined();
    expect(august.getByText("2,400円")).toBeDefined();
    expect(august.getByText("支出")).toBeDefined();
    expect(august.getByText("1,200円")).toBeDefined();
    expect(within(rows()[5] as HTMLElement).getAllByText("0円")).toHaveLength(2);
  });

  it("取引が無くても6か月すべてに収入と支出のゼロを表示する", () => {
    renderApp({ month: "2026-02" });
    expect(rows()).toHaveLength(6);
    for (const row of rows()) expect(within(row).getAllByText("0円")).toHaveLength(2);
  });

  it("月変更で対象期間と集計を更新する", () => {
    renderApp({
      month: "2026-09",
      transactions: [transaction({ date: "2026-04-01", amount: 1234 })],
    });
    expect(within(rows()[0] as HTMLElement).getByText("1,234円")).toBeDefined();
    act(() => setMonth("2026-10"));
    expect(within(rows()[0] as HTMLElement).getByText("5月")).toBeDefined();
    expect(within(rows()[5] as HTMLElement).getByText("10月")).toBeDefined();
    expect(screen.getByRole("region", { name: "6 か月の推移" }).textContent).not.toContain(
      "1,234円",
    );
  });

  it("登録した取引を推移に即座に反映する", async () => {
    const { user } = renderApp({ month: "2026-09" });
    await user.click(screen.getByRole("button", { name: "収支を記録" }));
    fireEvent.change(screen.getByLabelText("日付"), { target: { value: "2026-08-15" } });
    await user.type(screen.getByLabelText("金額"), "1200");
    await user.click(screen.getByRole("button", { name: "記録" }));
    expect(within(rows()[4] as HTMLElement).getByText("1,200円")).toBeDefined();
  });
});
