import { transaction } from "../../test-utils";
import { calculateTrend } from "./calculate";

describe("月ごとの推移の集計", () => {
  it("年をまたぐ6か月を古い順に並べ、取引が無ければすべてゼロにする", () => {
    const result = calculateTrend([], "2026-02");
    expect(result).toEqual({
      months: ["2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02"].map((month) => ({
        month,
        income: 0,
        expense: 0,
      })),
      max: 0,
    });
  });

  it("期間の両端を含めて収支別に合算し、期間外を除外して共通の最大値を求める", () => {
    const transactions = [
      transaction({ date: "2026-03-31", amount: 999999 }),
      transaction({ date: "2026-04-01", type: "income", amount: 2000 }),
      transaction({ date: "2026-04-30", type: "income", amount: 3000 }),
      transaction({ date: "2026-04-15", amount: 1200 }),
      transaction({ date: "2026-09-01", amount: 4000 }),
      transaction({ date: "2026-09-30", amount: 2000 }),
      transaction({ date: "2026-10-01", type: "income", amount: 999999 }),
    ];
    const before = structuredClone(transactions);
    expect(calculateTrend(transactions, "2026-09")).toEqual({
      months: [
        { month: "2026-04", income: 5000, expense: 1200 },
        { month: "2026-05", income: 0, expense: 0 },
        { month: "2026-06", income: 0, expense: 0 },
        { month: "2026-07", income: 0, expense: 0 },
        { month: "2026-08", income: 0, expense: 0 },
        { month: "2026-09", income: 0, expense: 6000 },
      ],
      max: 6000,
    });
    expect(transactions).toEqual(before);
  });

  it("収入だけの月も最大値の対象にする", () => {
    expect(calculateTrend([transaction({ type: "income", amount: 12000 })], "2026-09").max).toBe(
      12000,
    );
  });
});
