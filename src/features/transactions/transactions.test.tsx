import { screen, within } from "@testing-library/react";
import { renderApp, transaction } from "../../test-utils";

describe("取引の一覧", () => {
  it("表示中の月の取引を、日付の新しい順・同じ日なら記録の新しい順に並べる", () => {
    renderApp({
      month: "2026-09",
      transactions: [
        transaction({ date: "2026-09-03", memo: "古い日" }),
        transaction({ date: "2026-09-20", memo: "同じ日の先" }),
        transaction({ date: "2026-08-31", memo: "前の月" }),
        transaction({
          date: "2026-09-20",
          memo: "同じ日の後",
          type: "income",
          categoryId: "salary",
        }),
      ],
    });

    const items = within(screen.getByRole("region", { name: "取引" })).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("同じ日の後"),
      expect.stringContaining("同じ日の先"),
      expect.stringContaining("古い日"),
    ]);
    expect(within(items[0] as HTMLElement).getByText("給与")).toBeDefined();
  });

  it("取引の無い月は、取引が無いと出す", () => {
    renderApp({ month: "2026-09", transactions: [transaction({ date: "2026-08-01" })] });

    expect(screen.getByText(/この月の取引はまだありません/)).toBeDefined();
  });
});
