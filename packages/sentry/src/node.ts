import { NodeOptions, init as nodeInit } from "@sentry/node";

import { NORMALIZE_DEPTH, SENTRY_DSN, SENTRY_ENVIRONMENT } from "./constants.js";

export * from "./constants.js";
export * from "@sentry/node";

export function init(options?: NodeOptions) {
  return nodeInit({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    normalizeDepth: NORMALIZE_DEPTH,
    ...options,
  });
}
