export type SeverityLevel = "debug" | "error" | "fatal" | "info" | "log" | "warning";

export type CaptureExceptionHandler = (
  error: any,
  captureContext?: { extra: Record<string, unknown> }
) => void;

export type CaptureMessageHandler = (
  message: string,
  captureContext?: { extra: Record<string, unknown>; level: SeverityLevel }
) => void;
