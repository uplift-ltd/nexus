/* eslint-disable */

import { RequireAtLeastOne, RequireOnlyOne } from "../src/require";

// TODO: since jest uses babel for typescript these don't do anything outside of editor

describe("RequireAtLeastOne", () => {
  it("should not require one or both", () => {
    interface Props {
      a?: boolean;
      b?: boolean;
      c: boolean;
    }

    type RequiredProps = RequireAtLeastOne<Props, "a" | "b">;

    const a: RequiredProps = { a: true, c: true };
    const b: RequiredProps = { b: true, c: true };
    const ab: RequiredProps = { a: true, b: true, c: true };
    // @ts-expect-error
    const c: RequiredProps = { c: true };

    expect(true).toBe(true);
  });
});

describe("RequireOnlyOne", () => {
  it("should not require one or both", () => {
    interface Props {
      a?: boolean;
      b?: boolean;
      c: boolean;
    }

    type RequiredProps = RequireOnlyOne<Props, "a" | "b">;

    const a: RequiredProps = { a: true, c: true };
    const b: RequiredProps = { b: true, c: true };
    // @ts-expect-error
    const ab: RequiredProps = { a: true, b: true, c: true };
    // @ts-expect-error
    const c: RequiredProps = { c: true };

    expect(true).toBe(true);
  });
});
