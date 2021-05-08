import * as Sentry from "@sentry/browser";

if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.REACT_APP_SENTRY_PUBLIC_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.REACT_APP_SENTRY_PUBLIC_DSN,
  });
}

export default Sentry;
