import atob from "atob";
import { fromGlobalId } from "../src/fromGlobalId";

describe("fromGlobalId", () => {
  beforeAll(() => {
    global.atob = atob;
  });

  afterAll(() => {
    delete global.atob;
  });

  it("should parse global id", () => {
    expect(fromGlobalId("VXNlcjox")).toEqual("1");
  });

  it("should return original string if failed to parse", () => {
    expect(fromGlobalId("1")).toEqual("1");
  });
});
