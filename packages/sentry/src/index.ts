import * as Sentry from "@sentry/node";
import { SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

export default Sentry;
