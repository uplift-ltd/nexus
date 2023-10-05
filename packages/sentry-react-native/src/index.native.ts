import { init } from "sentry-expo";
import { NORMALIZE_DEPTH, SENTRY_DSN, SENTRY_ENVIRONMENT } from "./constants.js";

if (SENTRY_DSN) {
  init({
    debug: typeof __DEV__ !== "undefined",
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: typeof __DEV__ !== "undefined",
    environment: SENTRY_ENVIRONMENT,
    normalizeDepth: NORMALIZE_DEPTH,
  });
}

export * from "./constants.js";

export * from "sentry-expo";

// eslint-disable-next-line import/no-extraneous-dependencies
export { captureEvent, captureException, captureMessage } from "@sentry/react-native";
