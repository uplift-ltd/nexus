import * as Sentry from "sentry-expo";

if (process.env.SENTRY_PUBLIC_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_PUBLIC_DSN,
    enableInExpoDevelopment: typeof __DEV__ !== "undefined",
    debug: typeof __DEV__ !== "undefined",
  });
}

export default Sentry;
