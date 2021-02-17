import atob from "atob";
import btoa from "btoa";
import { bumpGlobalId } from "../src/bumpGlobalId";
import { toGlobalId } from "../src/toGlobalId";

const USER_1 = "VXNlcjox";
const USER_2 = "VXNlcjoy";
const USER_5 = "VXNlcjo1";

describe("fromGlobalId", () => {
  beforeAll(() => {
    global.atob = atob;
    global.btoa = btoa;
  });

  afterAll(() => {
    delete global.atob;
    delete global.btoa;
  });

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
