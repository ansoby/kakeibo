import { screen } from "@testing-library/react";
import { STORAGE_KEY } from "../store/storage";
import { renderApp } from "../test-utils";
import { setMonth } from "./month";

describe("App", () => {
  it("URL の月を表示する", () => {
    renderApp({ month: "2026-09" });
    expect(screen.getByText("2026年9月")).toBeDefined();
  });

  it("正しくない月のクエリは今月として扱う", () => {
    renderApp({ month: "2026-13" });
    const now = new Date();
    expect(screen.getByText(`${now.getFullYear()}年${now.getMonth() + 1}月`)).toBeDefined();
  });

  it("月を変えると URL と表示が変わる", async () => {
    const { findByText } = renderApp({ month: "2026-09" });
    setMonth("2026-10");
    expect(await findByText("2026年10月")).toBeDefined();
    expect(window.location.search).toBe("?month=2026-10");
  });

  it("保存されたデータを読めなければ、理由を出す", () => {
    localStorage.setItem(STORAGE_KEY, "{");
    renderApp();
    expect(screen.getByRole("alert").textContent).toMatch(/JSON として読めません/);
  });
});
