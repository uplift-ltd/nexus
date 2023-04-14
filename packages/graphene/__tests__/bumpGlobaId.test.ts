import { bumpGlobalId } from "../src/bumpGlobalId.js";
import { toGlobalId } from "../src/toGlobalId.js";

const USER_1 = "VXNlcjox";
const USER_2 = "VXNlcjoy";
const USER_5 = "VXNlcjo1";

describe("fromGlobalId", () => {
  it("should incremenet by 1", () => {
    expect(bumpGlobalId(USER_1)).toEqual(USER_2);
  });

  it("should increment by 4", () => {
    expect(bumpGlobalId(USER_1, 4)).toEqual(USER_5);
  });

  it("should throw if id is not a number", () => {
    expect(() => bumpGlobalId(toGlobalId("User", "abc123"))).toThrow();
  });
});
