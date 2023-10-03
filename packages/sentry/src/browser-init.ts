import { init } from "./browser.js";
import { SENTRY_DSN } from "./constants.js";

if (SENTRY_DSN) {
  init();
}
