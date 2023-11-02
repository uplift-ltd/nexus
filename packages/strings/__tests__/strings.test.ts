import {
  capitalize,
  formatPhoneNumber,
  formatUsCurrency,
  makePluralizer,
  pluralize,
  safeJoin,
  safeJoinWithComma,
  safeJoinWithEmDash,
  safeJoinWithEnDash,
  safeJoinWithSpace,
  safeJsonParse,
} from "../src/index.js";

test("capitalize", () => {
  expect(capitalize("")).toBe("");
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

describe("pluralize", () => {
  test("legacy pluralize", () => {
    const getCarsLabel = pluralize("car", "cars");

    expect(getCarsLabel(0)).toBe("0 cars");
    expect(getCarsLabel(1)).toBe("1 car");
    expect(getCarsLabel(2)).toBe("2 cars");
  });

  test("makePluralizer with plural", () => {
    const hatsPluralizer = makePluralizer({
      includeCount: false,
      plural: "axes",
      singular: "ax",
    });

    expect(hatsPluralizer(0)).toBe("axes");
    expect(hatsPluralizer(1)).toBe("ax");
    expect(hatsPluralizer(5)).toBe("axes");
  });

  test("makePluralizer with plural and count", () => {
    const hatsPluralizer = makePluralizer({
      includeCount: true,
      plural: "axes",
      singular: "ax",
    });

    expect(hatsPluralizer(0)).toBe("0 axes");
    expect(hatsPluralizer(1)).toBe("1 ax");
    expect(hatsPluralizer(5)).toBe("5 axes");
  });

  test("makePluralizer with implied plural", () => {
    const hatsPluralizer = makePluralizer({
      includeCount: false,
      singular: "hat",
    });

    expect(hatsPluralizer(0)).toBe("hats");
    expect(hatsPluralizer(1)).toBe("hat");
    expect(hatsPluralizer(5)).toBe("hats");
  });

  test("makePluralizer with implied plural and count", () => {
    const hatsPluralizer = makePluralizer({
      includeCount: true,
      singular: "hat",
    });

    expect(hatsPluralizer(0)).toBe("0 hats");
    expect(hatsPluralizer(1)).toBe("1 hat");
    expect(hatsPluralizer(5)).toBe("5 hats");
  });
});

test("safeJsonParse", () => {
  const testUser = { firstName: "John", lastName: "Smith" };

  // parse some valid items
  expect(safeJsonParse("[]")).toEqual([]);
  expect(safeJsonParse("true")).toBe(true);

  // test default fallback for invalid json
  expect(safeJsonParse("")).toBeUndefined();
  expect(safeJsonParse(JSON.stringify(testUser).slice(0, 5))).toBeUndefined();

  // test explicit fallback value for invalid JSON
  expect(safeJsonParse("", {})).toEqual({});
  expect(safeJsonParse(JSON.stringify(testUser).slice(0, 5), testUser)).toBe(testUser);

  // test valid parsing
  expect(safeJsonParse(JSON.stringify(testUser))).toEqual(testUser);
  expect(safeJsonParse("[1,2,3,4]", [])).toEqual([1, 2, 3, 4]);

  // test reviver
  const lowerCaseStringValues = (_key, value) =>
    typeof value === "string" ? value.toLowerCase() : value;
  expect(safeJsonParse(JSON.stringify(testUser), {}, lowerCaseStringValues)).toEqual({
    firstName: "john",
    lastName: "smith",
  });
});

test("safeJoins", () => {
  const input = [false, null, "   Hello ", undefined, " World", null, "", 123];

  expect(safeJoinWithSpace(...input)).toBe("Hello World 123");
  expect(safeJoinWithComma(...input)).toBe("Hello, World, 123");
  expect(safeJoinWithEnDash(...input)).toBe("Hello–World–123");
  expect(safeJoinWithEmDash(...input)).toBe("Hello — World — 123");

  expect(safeJoin(":")(...input)).toBe("Hello:World:123");
});
