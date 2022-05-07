import { init } from "@sentry/node";
import { NORMALIZE_DEPTH, SENTRY_DSN, SENTRY_ENVIRONMENT } from "./constants";

if (SENTRY_DSN) {
  init({
    dsn: SENTRY_DSN,
    normalizeDepth: NORMALIZE_DEPTH,
    environment: SENTRY_ENVIRONMENT,
  });
}

export * from "./constants";

export * from "@sentry/node";

export { captureEvent, captureException, captureMessage } from "@sentry/node";
