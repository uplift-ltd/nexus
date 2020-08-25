import { parseAmount } from "../src/parseAmount";

describe("parseAmount", () => {
  it("should parse empty string as 0", () => {
    expect(parseAmount("")).toEqual(0);
  });

  it("should parse missing currency", () => {
    expect(parseAmount("10")).toEqual(10);
  });

  it("should parse 0 USD", () => {
    expect(parseAmount("0 USD")).toEqual(0);
  });

  it("should parse 100 USD", () => {
    expect(parseAmount("100 USD")).toEqual(100);
  });

  it("should parse 123,456.78 USD", () => {
    expect(parseAmount("123,456.78 USD")).toEqual(123456.78);
  });
});
