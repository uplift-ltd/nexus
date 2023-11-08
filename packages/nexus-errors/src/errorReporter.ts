import {
  NexusExceptionHandler,
  NexusExceptionHandlerProps,
  NexusMessageHandler,
  NexusMessageHandlerProps,
} from "./types.js";

const noop = () => {
  // noop
};

export class NexusErrorReporter {
  private exceptionHandler: NexusExceptionHandler;

  private messageHandler: NexusMessageHandler;

  constructor() {
    this.exceptionHandler = noop;
    this.messageHandler = noop;
  }

  captureException<TContext>(error: NexusExceptionHandlerProps["error"], context?: TContext) {
    return this.exceptionHandler(error, context);
  }

  captureMessage<TContext>(message: NexusMessageHandlerProps["message"], context?: TContext) {
    return this.messageHandler(message, context);
  }

  registerExceptionHandler(exceptionHandler: NexusExceptionHandler) {
    this.exceptionHandler = exceptionHandler;
  }

  registerMessageHandler(messageHandler: NexusMessageHandler) {
    this.messageHandler = messageHandler;
  }
}

export const nexusErrorReporter = new NexusErrorReporter();

export const {
  captureException,
  captureMessage,
  registerExceptionHandler,
  registerMessageHandler,
} = nexusErrorReporter;
