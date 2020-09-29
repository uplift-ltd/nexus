# @uplift-ltd/sentry

## Installation

    yarn add @uplift-ltd/sentry

## API

```ts
import Sentry from "@uplift-ltd/sentry";

Sentry.captureException(new Error("Baroque"));

Sentry.captureMessage("Does not compute");
```

Add `REACT_APP_SENTRY_PUBLIC_DSN` to `.env`. If using in Node (for example for Next.js) you can add
a separate `NODE_SENTRY_PUBLIC_DSN` (defaults to `REACT_APP_SENTRY_PUBLIC_DSN` if not provided).

### React Native

Note: May need to set up
[babel-plugin-transform-inline-environment-variables](https://babeljs.io/docs/en/babel-plugin-transform-inline-environment-variables/).
