import { initClient } from "../src/configure.js";

describe("configure apollo", () => {
  it("should always return new client not in browser", () => {
    expect(initClient({})).not.toEqual(initClient({}));
  });
});
