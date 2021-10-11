import * as Sentry from "sentry-expo";
import { NORMALIZE_DEPTH, SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    normalizeDepth: NORMALIZE_DEPTH,
    enableInExpoDevelopment: typeof __DEV__ !== "undefined",
    debug: typeof __DEV__ !== "undefined",
  });
}

export default Sentry;

// eslint-disable-next-line import/no-extraneous-dependencies
export type { CaptureContext } from "@sentry/types";
