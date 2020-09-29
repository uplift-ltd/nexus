import { initClient } from "../src/configure";

describe("configure apollo", () => {
  it("should always return new client not in browser", () => {
    expect(initClient({})).not.toEqual(initClient({}));
  });
});
