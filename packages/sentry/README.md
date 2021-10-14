# @uplift-ltd/sentry

## Installation

    yarn add @uplift-ltd/sentry

## API

```ts
import { captureException, captureMessage } from "@uplift-ltd/sentry";

Sentry.captureException(new Error("Baroque"));

Sentry.captureMessage("Does not compute");
```

Add `NEXT_PUBLIC_SENTRY_PUBLIC_DSN` to `.env`. If using in Node (for example for Next.js) you can
add a separate `SENTRY_DNS` (defaults to `NEXT_PUBLIC_SENTRY_PUBLIC_DSN` if not provided).
