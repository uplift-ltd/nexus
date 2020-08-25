import { notEmpty } from "../src/notEmpty";

describe("notEmpty", () => {
  it("should not return null or undefined", () => {
    const array = [null, undefined, 0, 1, "2", {}, []];
    const filteredArray: Array<number | string | {} | []> = array.filter(notEmpty);
    expect(filteredArray).toEqual([0, 1, "2", {}, []]);
  });
});
