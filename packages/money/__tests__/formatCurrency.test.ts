import {
  formatCurrency,
  formatCurrencyInteger,
  formatCurrencyZero,
} from "../src/formatCurrency.js";

describe("formatCurrency", () => {
  it("should format $0.00", () => {
    expect(formatCurrency(0, "USD")).toEqual("$0.00");
  });

  it("should format $1,000.00", () => {
    expect(formatCurrency(1000, "USD")).toEqual("$1,000.00");
  });

  it("should format $123,456.78", () => {
    expect(formatCurrency(123456.78, "USD")).toEqual("$123,456.78");
  });

  it("should format null as $0.00", () => {
    expect(formatCurrency(null, "USD")).toEqual("$0.00");
  });

  it("should format undefined as $0.00", () => {
    // @ts-expect-error undefined not allowed by types but could happen
    expect(formatCurrency(undefined, "USD")).toEqual("$0.00");
  });
});

describe("formatCurrencyZero", () => {
  it("should format $0", () => {
    expect(formatCurrencyZero(0, "USD")).toEqual("$0");
  });

  it("should format $1,000.00", () => {
    expect(formatCurrencyZero(1000, "USD")).toEqual("$1,000.00");
  });

  it("should format $123,456.78", () => {
    expect(formatCurrencyZero(123456.78, "USD")).toEqual("$123,456.78");
  });

  it("should format null as $0", () => {
    expect(formatCurrencyZero(null, "USD")).toEqual("$0");
  });

  it("should format undefined as $0", () => {
    // @ts-expect-error undefined not allowed by types but could happen
    expect(formatCurrencyZero(undefined, "USD")).toEqual("$0");
  });
});

describe("formatCurrencyInteger", () => {
  it("should format $0", () => {
    expect(formatCurrencyInteger(0, "USD")).toEqual("$0");
  });

  it("should format $1,000", () => {
    expect(formatCurrencyInteger(1000, "USD")).toEqual("$1,000");
  });

  it("should format $123,456.78", () => {
    expect(formatCurrencyInteger(123456.78, "USD")).toEqual("$123,456.78");
  });

  it("should format null as $0", () => {
    expect(formatCurrencyInteger(null, "USD")).toEqual("$0");
  });

  it("should format undefined as $0", () => {
    // @ts-expect-error undefined not allowed by types but could happen
    expect(formatCurrencyInteger(undefined, "USD")).toEqual("$0");
  });
});
