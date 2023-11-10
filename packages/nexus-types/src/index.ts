export type SeverityLevel = "debug" | "error" | "fatal" | "info" | "log" | "warning";

export type CaptureExceptionHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  captureContext?: { extra: Record<string, unknown> }
) => void;

export type CaptureMessageHandler = (
  message: string,
  captureContext?: { extra: Record<string, unknown>; level: SeverityLevel }
) => void;
