import { init } from "@sentry/browser";
import { NORMALIZE_DEPTH, SENTRY_DSN, SENTRY_ENVIRONMENT } from "./constants.js";

if (SENTRY_DSN) {
  init({
    dsn: SENTRY_DSN,
    normalizeDepth: NORMALIZE_DEPTH,
    environment: SENTRY_ENVIRONMENT,
  });
}

export * from "./constants.js";

export * from "@sentry/browser";

export { captureEvent, captureException, captureMessage, showReportDialog } from "@sentry/browser";
