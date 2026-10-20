import {
  addMonths,
  currentMonth,
  formatDay,
  formatMonth,
  isDate,
  isMonth,
  monthOf,
  today,
} from "./month";

describe("month", () => {
  it("月の形を確かめる", () => {
    expect(isMonth("2026-09")).toBe(true);
    expect(isMonth("2026-13")).toBe(false);
    expect(isMonth("2026-9")).toBe(false);
  });

  it("暦に無い日付を受けない", () => {
    expect(isDate("2026-02-28")).toBe(true);
    expect(isDate("2028-02-29")).toBe(true);
    expect(isDate("2026-02-29")).toBe(false);
    expect(isDate("2026-04-31")).toBe(false);
  });

  it("端末の日付で今日と今月を出す", () => {
    const now = new Date(2026, 0, 5, 23, 59);
    expect(today(now)).toBe("2026-01-05");
    expect(currentMonth(now)).toBe("2026-01");
  });

  it("日付の月を出す", () => {
    expect(monthOf("2026-09-30")).toBe("2026-09");
  });

  it("年をまたいで月をずらす", () => {
    expect(addMonths("2026-01", -1)).toBe("2025-12");
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2026-09", -5)).toBe("2026-04");
    expect(addMonths("2026-09", 0)).toBe("2026-09");
  });

  it("表示の形にする", () => {
    expect(formatMonth("2026-09")).toBe("2026年9月");
    expect(formatDay("2026-09-05")).toBe("9/5");
  });
});
