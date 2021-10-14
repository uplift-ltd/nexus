# @uplift-ltd/sentry-react-native

## Installation

    yarn add @uplift-ltd/sentry-react-native

## API

```ts
import { captureException, captureMessage } from "@uplift-ltd/sentry-react-native";

Sentry.captureException(new Error("Baroque"));

Sentry.captureMessage("Does not compute");
```

Add `NEXT_PUBLIC_SENTRY_DSN` to `.env`. If using in Node (for example for Next.js) you can add a
separate `SENTRY_DSN` (defaults to `NEXT_PUBLIC_SENTRY_DSN` if not provided).

### React Native

Note: May need to set up
[babel-plugin-transform-inline-environment-variables](https://babeljs.io/docs/en/babel-plugin-transform-inline-environment-variables/).
