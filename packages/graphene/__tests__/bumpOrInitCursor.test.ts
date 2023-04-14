import { bumpOrInitCursor } from "../src/bumpOrInitCursor.js";
import { toGlobalId } from "../src/toGlobalId.js";

const CURSOR_1 = "YXJyYXljb25uZWN0aW9uOjE=";
const CURSOR_2 = "YXJyYXljb25uZWN0aW9uOjI=";
const CURSOR_10 = "YXJyYXljb25uZWN0aW9uOjEw";

describe("fromGlobalId", () => {
  it("should init if null or undefined", () => {
    expect(bumpOrInitCursor(null)).toEqual(CURSOR_1);
    expect(bumpOrInitCursor(undefined)).toEqual(CURSOR_1);
  });

  it("should increment by 1", () => {
    expect(bumpOrInitCursor(CURSOR_1)).toEqual(CURSOR_2);
  });

  it("should increment by 9", () => {
    expect(bumpOrInitCursor(CURSOR_1, 9)).toEqual(CURSOR_10);
  });

  it("should throw if id is not a number", () => {
    expect(() => bumpOrInitCursor(toGlobalId("arrayconnection", "abc123"))).toThrow();
  });
});
