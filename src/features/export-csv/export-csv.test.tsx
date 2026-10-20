import { act, screen, waitFor } from "@testing-library/react";
import { setMonth } from "../../app/month";
import { STORAGE_KEY } from "../../store/storage";
import { renderApp, transaction } from "../../test-utils";

const csvButton = () => screen.getByRole<HTMLButtonElement>("button", { name: "CSV" });

describe("CSV の書き出し", () => {
  afterEach(() => vi.restoreAllMocks());

  it("表示月が空なら無効にし、月の変更に追従する", () => {
    renderApp({ month: "2026-09", transactions: [transaction({ date: "2026-08-01" })] });
    expect(csvButton().disabled).toBe(true);
    act(() => setMonth("2026-08"));
    expect(csvButton().disabled).toBe(false);
    act(() => setMonth("2026-10"));
    expect(csvButton().disabled).toBe(true);
  });

  it("表示月だけを一覧順でダウンロードし、保存データを変更しない", async () => {
    const transactions = [
      transaction({ date: "2026-09-03", memo: "古い日" }),
      transaction({ date: "2026-09-20", memo: "同じ日の先" }),
      transaction({ date: "2026-08-31", memo: "対象外" }),
      transaction({ date: "2026-09-20", memo: 'パン,"特売"' }),
    ];
    const { user } = renderApp({ month: "2026-09", transactions });
    const saved = localStorage.getItem(STORAGE_KEY);
    let downloaded: Blob | undefined;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      downloaded = blob as Blob;
      return "blob:csv-test";
    });
    const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      expect(this.download).toBe("kakeibo-2026-09.csv");
      expect(this.href).toBe("blob:csv-test");
      expect(this.isConnected).toBe(true);
    });

    await user.click(csvButton());
    expect(click).toHaveBeenCalledTimes(1);
    expect(downloaded?.type).toBe("text/csv;charset=utf-8");
    if (downloaded === undefined) throw new Error("CSV が生成されていません。");
    const bytes = new Uint8Array(await downloaded.arrayBuffer());
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(new TextDecoder().decode(bytes)).toBe(
      "日付,収支,カテゴリ,金額,メモ\r\n" +
        '2026-09-20,支出,食費,1000,"パン,""特売"""\r\n' +
        "2026-09-20,支出,食費,1000,同じ日の先\r\n" +
        "2026-09-03,支出,食費,1000,古い日\r\n",
    );
    expect(document.querySelector("a[download]")).toBeNull();
    await waitFor(() => expect(revoke).toHaveBeenCalledWith("blob:csv-test"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);

    act(() => setMonth("2026-08"));
    click.mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe("kakeibo-2026-08.csv");
    });
    await user.click(csvButton());
    expect(await downloaded?.text()).toContain("2026-08-31,支出,食費,1000,対象外");
    expect(await downloaded?.text()).not.toContain("2026-09-");
    await waitFor(() => expect(revoke).toHaveBeenCalledTimes(2));
  });
});
