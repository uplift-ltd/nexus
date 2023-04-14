import { makeGraphqlUnionMemberGuard, makeUnionMemberGuard } from "../src/unionMemberGuard.js";

describe("unionMemberGuard", () => {
  describe("makeUnionMemberGuard", () => {
    it("should filter by __typename", () => {
      type A = {
        __typename: "A";
        x: number;
      };

      type B = {
        __typename: "B";
        y: number;
      };

      type AB = A | B;

      const a = { __typename: "A", x: 1 } as const;
      const b = { __typename: "B", y: 2 } as const;

      const ab: AB[] = [a, b];

      const aArray = ab.filter(makeUnionMemberGuard("__typename", "A"));
      const bArray = ab.filter(makeUnionMemberGuard("__typename", "B"));

      expect(aArray).toEqual([a]);
      expect(bArray).toEqual([b]);
    });
  });

  describe("makeGraphqlUnionMemberGuard", () => {
    it("should filter by __typename", () => {
      type A = {
        __typename: "A";
        x: number;
      };

      type B = {
        __typename: "B";
        y: number;
      };

      type AB = A | B;

      const a = { __typename: "A", x: 1 } as const;
      const b = { __typename: "B", y: 2 } as const;

      const ab: AB[] = [a, b];

      const aArray = ab.filter(makeGraphqlUnionMemberGuard("A"));
      const bArray = ab.filter(makeGraphqlUnionMemberGuard("B"));

      expect(aArray).toEqual([a]);
      expect(bArray).toEqual([b]);
    });
  });
});
