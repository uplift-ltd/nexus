# @uplift-ltd/sentry

## Installation

    npm i --save @uplift-ltd/sentry

## API

Automatically register Sentry without configuration,

```ts
import "@uplift-ltd/sentry/browser-init";

// OR

import "@uplift-ltd/sentry/node-init";
```

Or manually register to control init or add options,

```ts
import { init } from "@uplift-ltd/sentry/browser";

init({ ... })

// OR

import { init } from "@uplift-ltd/sentry/node";

init({ ... })
```

```ts
import { captureException, captureMessage } from "@uplift-ltd/sentry";

Sentry.captureException(new Error("Baroque"));

Sentry.captureMessage("Does not compute");
```

Add `NEXT_PUBLIC_SENTRY_DSN` to `.env`. If using in Node (for example for Next.js) you can add a
separate `SENTRY_DSN` (defaults to `NEXT_PUBLIC_SENTRY_DSN` if not provided).

### React Native

See the `@uplift-ltd/sentry-react-native` package.
