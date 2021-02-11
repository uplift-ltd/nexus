import {
  capitalize,
  formatPhoneNumber,
  formatUsCurrency,
  pluralize,
  safeJoin,
  safeJoinWithSpace,
  safeJoinWithComma,
  safeJoinWithEnDash,
  safeJoinWithEmDash,
  makeUrl,
} from "../src";

test("capitalize", () => {
  expect(capitalize("uplift")).toBe("Uplift");
  expect(capitalize("UPLIFT")).toBe("UPLIFT");
  expect(capitalize("Uplift")).toBe("Uplift");
});

test("formatPhoneNumber", () => {
  expect(formatPhoneNumber("7859179500")).toBe("(785) 917-9500");
  expect(formatPhoneNumber("+17859179500")).toBe("1 (785) 917-9500");
  expect(formatPhoneNumber("785917-9500")).toBe("(785) 917-9500");
  expect(formatPhoneNumber("+1 785 9179500")).toBe("1 (785) 917-9500");
});

test("formatUsCurrency", () => {
  expect(formatUsCurrency(123.12)).toBe("$123.12");
  expect(formatUsCurrency(123.12, true)).toBe("$123");
});

test("pluralize", () => {
  const getCarsLabel = pluralize("car", "cars");

  expect(getCarsLabel(0)).toBe("0 cars");
  expect(getCarsLabel(1)).toBe("1 car");
  expect(getCarsLabel(2)).toBe("2 cars");
});

test("safeJoins", () => {
  const input = [false, null, "   Hello ", undefined, " World", null, "", 123];

  expect(safeJoinWithSpace(...input)).toBe("Hello World 123");
  expect(safeJoinWithComma(...input)).toBe("Hello, World, 123");
  expect(safeJoinWithEnDash(...input)).toBe("Hello–World–123");
  expect(safeJoinWithEmDash(...input)).toBe("Hello — World — 123");

  expect(safeJoin(":")(...input)).toBe("Hello:World:123");
});

test("makeUrls", () => {
  const TEST_URL = "/test-url/:tokenId";
  const MULTIPLE_TOKEN_TEST_URL = "/test-url/:tokenId/:userId";

  expect(makeUrl(TEST_URL, { tokenId: "654" })).toBe("/test-url/654");
  expect(makeUrl(TEST_URL, { tokenId: 123 })).toBe("/test-url/123");
  expect(makeUrl(TEST_URL, { tokenId: 123 }, { msg: "Hello" })).toBe("/test-url/123?msg=Hello");

  expect(makeUrl(MULTIPLE_TOKEN_TEST_URL, { tokenId: 987, userId: "ABC123" })).toBe(
    "/test-url/987/ABC123"
  );
  expect(
    makeUrl(
      MULTIPLE_TOKEN_TEST_URL,
      { tokenId: 987, userId: "ABC123" },
      { msg: "Hello", null: null, undefined }
    )
  ).toBe("/test-url/987/ABC123?msg=Hello");
});
