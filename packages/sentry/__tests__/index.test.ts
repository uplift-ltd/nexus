import { captureException, captureMessage } from "../src/index.js";

describe("Sentry", () => {
  it("should have captureException and captureMessage", () => {
    expect(captureException).toBeDefined();
    expect(captureMessage).toBeDefined();
  });
});
