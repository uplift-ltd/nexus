import { NORMALIZE_DEPTH, SENTRY_DSN, SENTRY_ENVIRONMENT } from "./constants";
import { init } from "./node";

if (SENTRY_DSN) {
  init();
}
