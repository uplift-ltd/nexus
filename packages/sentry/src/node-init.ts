import { SENTRY_DSN } from "./constants";
import { init } from "./node";

if (SENTRY_DSN) {
  init();
}
