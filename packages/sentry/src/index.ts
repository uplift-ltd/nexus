import * as Sentry from "@sentry/node";
import { NORMALIZE_DEPTH, SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    normalizeDepth: NORMALIZE_DEPTH,
  });
}

export default Sentry;
