import { init } from "@sentry/browser";
import { NORMALIZE_DEPTH, SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  init({
    dsn: SENTRY_DSN,
    normalizeDepth: NORMALIZE_DEPTH,
  });
}

export * from "./constants";

export * from "@sentry/browser";

export { captureEvent, captureException, captureMessage, showReportDialog } from "@sentry/browser";
