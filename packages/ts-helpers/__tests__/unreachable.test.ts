/* eslint-disable */

import { UnreachableCaseError, assertUnreachable } from "../src/unreachable.js";

describe("UnreachableCaseError", () => {
  it("should throw an error", () => {
    expect(() => {
      if (false) {
        // @ts-expect-error
        throw new UnreachableCaseError("Should never be false");
      }
    }).not.toThrow();
  });

  it("should have right message", () => {
    expect(() => {
      // @ts-expect-error
      throw new UnreachableCaseError("oops");
    }).toThrow("Unreachable case: oops");
  });
});

describe("assertUnreachable", () => {
  it("should throw an instance of UnreachableCaseError", () => {
    expect(() => {
      // @ts-expect-error
      assertUnreachable("never");
    }).toThrow(UnreachableCaseError);
  });

  it("should have right message", () => {
    expect(() => {
      // @ts-expect-error
      assertUnreachable("oops");
    }).toThrow("Unreachable case: oops");
  });
});
