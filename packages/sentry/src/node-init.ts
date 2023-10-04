import { SENTRY_DSN } from "./constants.js";
import { init } from "./node.js";

if (SENTRY_DSN) {
  init();
}
