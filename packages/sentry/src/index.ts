import * as Sentry from "@sentry/browser";

if (process.env.SENTRY_PUBLIC_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_PUBLIC_DSN,
  });
}

export default Sentry;
