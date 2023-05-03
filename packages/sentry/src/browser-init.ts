import { init } from "./browser";
import { SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  init();
}
