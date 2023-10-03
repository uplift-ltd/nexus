import { SENTRY_DSN } from "./constants.js";
import { init } from "./node";

if (SENTRY_DSN) {
  init();
}
