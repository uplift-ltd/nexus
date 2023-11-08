export interface NexusExceptionHandlerProps {
  context: unknown;
  error: Error;
  returnType: void;
}

export interface NexusMessageHandlerProps {
  context: unknown;
  message: string;
  returnType: void;
}

export type NexusExceptionHandler = (
  error: NexusExceptionHandlerProps["error"],
  context?: NexusExceptionHandlerProps["context"]
) => NexusExceptionHandlerProps["returnType"] | Promise<NexusExceptionHandlerProps["returnType"]>;

export type NexusMessageHandler = (
  message: NexusMessageHandlerProps["message"],
  context?: NexusMessageHandlerProps["context"]
) => NexusMessageHandlerProps["returnType"] | Promise<NexusMessageHandlerProps["returnType"]>;
