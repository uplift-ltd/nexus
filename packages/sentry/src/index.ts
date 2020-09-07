import * as Sentry from "@sentry/browser";

if (process.env.REACT_APP_SENTRY_PUBLIC_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_PUBLIC_DSN,
  });
}

export default Sentry;
