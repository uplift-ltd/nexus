import { parseGlobalId } from "../src/parseGlobalId.js";

describe("parseGlobalId", () => {
  it("should parse global id", () => {
    expect(parseGlobalId("VXNlcjox")).toEqual({ name: "User", id: "1" });
  });
});
