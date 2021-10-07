import * as Sentry from "@sentry/react";
import { SENTRY_DSN } from "./constants";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

export default Sentry;
