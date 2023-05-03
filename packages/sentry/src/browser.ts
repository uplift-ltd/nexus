import {
  getCurrentHub,
  makeFetchTransport,
  defaultStackParser,
  Breadcrumbs,
  HttpContext,
  LinkedErrors,
  TryCatch,
  GlobalHandlers,
  BrowserClient,
} from "@sentry/browser";
import { BrowserClientOptions } from "@sentry/browser/types/client";
import { NORMALIZE_DEPTH, SENTRY_DSN, SENTRY_ENVIRONMENT } from "./constants";

export * from "./constants";
export * from "@sentry/browser";

export function init(options?: BrowserClientOptions) {
  return getCurrentHub().bindClient(
    new BrowserClient({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      integrations: [
        new Breadcrumbs(),
        new GlobalHandlers(),
        new HttpContext(),
        new LinkedErrors(),
        new TryCatch(),
      ],
      normalizeDepth: NORMALIZE_DEPTH,
      stackParser: defaultStackParser,
      transport: makeFetchTransport,
      ...options,
    })
  );
}
