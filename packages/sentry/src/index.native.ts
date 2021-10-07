import * as Sentry from "sentry-expo";
import { SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: typeof __DEV__ !== "undefined",
    debug: typeof __DEV__ !== "undefined",
  });
}

export default Sentry;
