import * as Sentry from "@sentry/node";

if (
  process.env.NODE_SENTRY_PUBLIC_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  process.env.REACT_APP_SENTRY_PUBLIC_DSN
) {
  Sentry.init({
    dsn:
      process.env.NODE_SENTRY_PUBLIC_DSN ||
      process.env.NEXT_PUBLIC_SENTRY_DSN ||
      process.env.REACT_APP_SENTRY_PUBLIC_DSN,
  });
}

export default Sentry;
