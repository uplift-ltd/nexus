export const SENTRY_DSN =
  process.env.SENTRY_DSN ||
  process.env.SENTRY_PUBLIC_DSN ||
  process.env.NODE_SENTRY_PUBLIC_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  process.env.REACT_APP_SENTRY_PUBLIC_DSN;

export const NORMALIZE_DEPTH = Number(
  process.env.SENTRY_NORMALIZE_DEPTH || process.env.NEXT_PUBLIC_SENTRY_NORMALIZE_DEPTH || 10
);
