---
title: sentry
---

## Installation

    yarn add @uplift-ltd/sentry

## API

```ts
import Sentry from "@uplift-ltd/sentry";

Sentry.captureException(new Error("Baroque"));

Sentry.captureMessage("Does not compute");
```

### React Native

Note: May need to set up
[babel-plugin-transform-inline-environment-variables](https://babeljs.io/docs/en/babel-plugin-transform-inline-environment-variables/).
