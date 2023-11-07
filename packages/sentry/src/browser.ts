import {
  Breadcrumbs,
  BrowserClient,
  GlobalHandlers,
  HttpContext,
  LinkedErrors,
  TryCatch,
  defaultStackParser,
  getCurrentHub,
  makeFetchTransport,
} from "@sentry/browser";
import { BrowserClientOptions } from "@sentry/browser/types/client";
import { DEFAULT_NORMALIZE_DEPTH } from "./constants.js";

export * from "./constants.js";
export * from "@sentry/browser";

const DEFAULT_SENTRY_INTEGRATIONS = [
  new Breadcrumbs(),
  new GlobalHandlers(),
  new HttpContext(),
  new LinkedErrors(),
  new TryCatch(),
];

export function init(options?: BrowserClientOptions) {
  return getCurrentHub().bindClient(
    new BrowserClient({
      integrations: DEFAULT_SENTRY_INTEGRATIONS,
      normalizeDepth: DEFAULT_NORMALIZE_DEPTH,
      stackParser: defaultStackParser,
      transport: makeFetchTransport,
      ...options,
    })
  );
}
