import { init as nodeInit, NodeOptions } from "@sentry/node";
import { NORMALIZE_DEPTH, SENTRY_DSN, SENTRY_ENVIRONMENT } from "./constants";

export * from "./constants.js";
export * from "@sentry/node";

export function init(options?: NodeOptions) {
  return nodeInit({
    dsn: SENTRY_DSN,
    normalizeDepth: NORMALIZE_DEPTH,
    environment: SENTRY_ENVIRONMENT,
    ...options,
  });
}
