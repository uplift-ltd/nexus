import { parseGlobalId } from "../src/parseGlobalId.js";

describe("parseGlobalId", () => {
  beforeAll(() => {
    global.atob = atob;
  });

  it("should parse global id", () => {
    expect(parseGlobalId("VXNlcjox")).toEqual({ name: "User", id: "1" });
  });
});
