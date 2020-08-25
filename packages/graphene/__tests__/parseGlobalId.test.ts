import atob from "atob";
import { parseGlobalId } from "../src/parseGlobalId";

describe("parseGlobalId", () => {
  beforeAll(() => {
    global.atob = atob;
  });

  afterAll(() => {
    delete global.atob;
  });

  it("should parse global id", () => {
    expect(parseGlobalId("VXNlcjox")).toEqual({ name: "User", id: "1" });
  });
});
