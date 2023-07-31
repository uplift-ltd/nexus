import { captureException, captureMessage } from "../src";

describe("Sentry", () => {
  it("should have captureException and captureMessage", () => {
    expect(captureException).toBeDefined();
    expect(captureMessage).toBeDefined();
  });
});
