import { transaction } from "../../test-utils";
import { calculateBreakdown } from "./calculate";

const summarize = (transactions: Parameters<typeof calculateBreakdown>[0]) =>
  calculateBreakdown(transactions, "2026-09");

describe("支出の内訳の集計", () => {
  it("表示月の支出だけをカテゴリごとに合算し、金額降順に並べる", () => {
    const transactions = Object.freeze([
      transaction({ amount: 1000 }),
      transaction({ categoryId: "daily", amount: 2000 }),
      transaction({ amount: 2000 }),
      transaction({ date: "2026-08-31", amount: 9000 }),
      transaction({ date: "2026-10-01", amount: 9000 }),
      transaction({ type: "income", categoryId: "salary", amount: 9000 }),
    ]);
    const before = structuredClone(transactions);
    const result = summarize(transactions);
    expect(
      result.rows.map(({ category, amount, percentage }) => [category.id, amount, percentage]),
    ).toEqual([
      ["food", 3000, 60],
      ["daily", 2000, 40],
    ]);
    expect(result.maxAmount).toBe(3000);
    expect(transactions).toEqual(before);
  });

  it("記録順が逆でも、合算後の同額カテゴリは定義順に並べる", () => {
    const result = summarize([
      transaction({ categoryId: "fun", amount: 1000 }),
      transaction({ categoryId: "daily", amount: 1000 }),
      transaction({ amount: 400 }),
      transaction({ amount: 600 }),
    ]);
    expect(result.rows.map(({ category }) => category.id)).toEqual(["food", "daily", "fun"]);
    expect(result.rows.map(({ percentage }) => percentage)).toEqual([33, 33, 33]);
  });

  it("割合の小数部分が0.5未満なら切り捨て、0.5なら切り上げる", () => {
    const result = summarize([
      transaction({ amount: 124 }),
      transaction({ categoryId: "daily", amount: 125 }),
      transaction({ categoryId: "fun", amount: 751 }),
    ]);
    expect(result.rows.map(({ category, percentage }) => [category.id, percentage])).toEqual([
      ["fun", 75],
      ["daily", 13],
      ["food", 12],
    ]);
  });

  it.each([
    [],
    [transaction({ type: "income", categoryId: "salary" })],
    [transaction({ date: "2026-08-31" })],
  ])("対象の支出がなければ空の結果を返す: %j", (...transactions) => {
    expect(summarize(transactions)).toEqual({ rows: [], maxAmount: 0 });
  });
});
