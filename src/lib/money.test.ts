import { formatYen, parseAmount } from "./money";

describe("parseAmount", () => {
  it.each([
    ["1200", 1200],
    ["1,200", 1200],
    [" 12,345,678 ", 12345678],
    ["1", 1],
  ])("%s を %d にする", (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each(["", "0", "-1", "1.5", "12,00", "1,2000", "abc", "１２００", "99999999999999999"])(
    "%s を受けない",
    (input) => {
      expect(parseAmount(input)).toBeNull();
    },
  );
});

describe("formatYen", () => {
  it("3 桁ごとに区切って円を付ける", () => {
    expect(formatYen(1234567)).toBe("1,234,567円");
    expect(formatYen(0)).toBe("0円");
    expect(formatYen(-1200)).toBe("-1,200円");
  });
});
