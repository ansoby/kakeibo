import { transaction } from "../../test-utils";
import { createCsv, csvFilename } from "./csv";

describe("CSV の形式", () => {
  it("BOM・見出し・CRLF と、日付・収支・カテゴリ・整数金額・空メモを出す", () => {
    expect(
      createCsv([
        transaction({ amount: 1200 }),
        transaction({ type: "income", categoryId: "salary", amount: 300000, memo: "給与" }),
      ]),
    ).toBe(
      "\uFEFF日付,収支,カテゴリ,金額,メモ\r\n" +
        "2026-09-05,支出,食費,1200,\r\n" +
        "2026-09-05,収入,給与,300000,給与\r\n",
    );
  });

  it.each([
    ["通常のメモ", "通常のメモ"],
    ["パン,牛乳", '"パン,牛乳"'],
    ['"特売"', '"""特売"""'],
    ["1行目\n2行目", '"1行目\n2行目"'],
    ["1行目\r2行目", '"1行目\r2行目"'],
    ['パン,"特売"\r\n牛乳', '"パン,""特売""\r\n牛乳"'],
  ])("メモ %j を RFC 4180 の形式で出す", (memo, escaped) => {
    expect(createCsv([transaction({ memo })])).toBe(
      `\uFEFF日付,収支,カテゴリ,金額,メモ\r\n2026-09-05,支出,食費,1000,${escaped}\r\n`,
    );
  });

  it("取引が空なら見出しだけを出す", () => {
    expect(createCsv([])).toBe("\uFEFF日付,収支,カテゴリ,金額,メモ\r\n");
  });

  it("表示月からファイル名を作る", () => {
    expect(csvFilename("2026-09")).toBe("kakeibo-2026-09.csv");
  });
});
