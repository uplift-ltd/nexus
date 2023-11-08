import { NexusErrorReporter } from "../src/index.js";

describe("nexus-errors", () => {
  describe("registerExceptionHandler", () => {
    it("should have called registered exception handler", () => {
      const errorReporter = new NexusErrorReporter();

      const captureException = jest.fn();

      errorReporter.registerExceptionHandler(captureException);

      const error = new Error("Yoo");
      const context = undefined;
      errorReporter.captureException(error);

      expect(captureException).toHaveBeenCalled();
      expect(captureException).toHaveBeenCalledWith(error, context);
    });

    it("should have called registered exception handler with context", () => {
      const errorReporter = new NexusErrorReporter();

      const captureException = jest.fn();

      errorReporter.registerExceptionHandler(captureException);

      const error = new Error("Yoo");
      const context = { extra: { a: "b" } };
      errorReporter.captureException(error, context);

      expect(captureException).toHaveBeenCalled();
      expect(captureException).toHaveBeenCalledWith(error, context);
    });
  });

  describe("registerMessageHandler", () => {
    it("should have called registered message handler", () => {
      const errorReporter = new NexusErrorReporter();

      const captureMessage = jest.fn();

      errorReporter.registerMessageHandler(captureMessage);

      const message = "Yoo";
      const context = undefined;
      errorReporter.captureMessage(message);

      expect(captureMessage).toHaveBeenCalled();
      expect(captureMessage).toHaveBeenCalledWith(message, context);
    });

    it("should have called registered message handler", () => {
      const errorReporter = new NexusErrorReporter();

      const captureMessage = jest.fn();

      errorReporter.registerMessageHandler(captureMessage);

      const message = "Yoo";
      const context = { extra: { a: "b" } };
      errorReporter.captureMessage(message, context);

      expect(captureMessage).toHaveBeenCalled();
      expect(captureMessage).toHaveBeenCalledWith(message, context);
    });
  });
});
