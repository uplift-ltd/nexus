import { parseGlobalId } from "../src/parseGlobalId.js";

describe("parseGlobalId", () => {
  it("should parse global id", () => {
    expect(parseGlobalId("VXNlcjox")).toEqual({ id: "1", name: "User" });
  });
});
