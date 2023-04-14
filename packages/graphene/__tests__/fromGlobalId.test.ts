import { fromGlobalId } from "../src/fromGlobalId.js";

describe("fromGlobalId", () => {
  it("should parse global id", () => {
    expect(fromGlobalId("VXNlcjox")).toEqual("1");
  });

  it("should return original string if failed to parse", () => {
    expect(fromGlobalId("1")).toEqual("1");
  });
});
