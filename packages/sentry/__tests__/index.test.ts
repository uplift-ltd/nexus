import * as Sentry from "../src";

describe("Sentry", () => {
  it("should have captureException and captureMessage", () => {
    expect(Sentry.captureException).toBeDefined();
    expect(Sentry.captureMessage).toBeDefined();
  });
});
