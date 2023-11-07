import { NodeOptions, init as nodeInit } from "@sentry/node";

import { DEFAULT_NORMALIZE_DEPTH } from "./constants.js";

export * from "@sentry/node";

export function init(options?: NodeOptions) {
  return nodeInit({
    normalizeDepth: DEFAULT_NORMALIZE_DEPTH,
    ...options,
  });
}
