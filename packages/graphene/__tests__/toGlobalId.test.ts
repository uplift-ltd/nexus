import { toGlobalId } from "../src/toGlobalId.js";

describe("toGlobalId", () => {
  it("should encode global id with number", () => {
    expect(toGlobalId("User", 1)).toEqual("VXNlcjox");
  });

  it("should encode global id with string", () => {
    expect(toGlobalId("User", "1")).toEqual("VXNlcjox");
  });
});
