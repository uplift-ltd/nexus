import btoa from "btoa";
import { toGlobalId } from "../src/toGlobalId";

describe("toGlobalId", () => {
  beforeAll(() => {
    global.btoa = btoa;
  });

  afterAll(() => {
    delete global.btoa;
  });

  it("should encode global id with number", () => {
    expect(toGlobalId("User", 1)).toEqual("VXNlcjox");
  });

  it("should encode global id with string", () => {
    expect(toGlobalId("User", "1")).toEqual("VXNlcjox");
  });
});
