import { init } from "@sentry/react";
import { NORMALIZE_DEPTH, SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  init({
    dsn: SENTRY_DSN,
    normalizeDepth: NORMALIZE_DEPTH,
  });
}

export * from "@sentry/react";

export { captureEvent, captureException, captureMessage } from "@sentry/react";
