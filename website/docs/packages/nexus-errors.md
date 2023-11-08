---
title: nexus-errors
---

## Installation

```sh
npm i --save @uplift-ltd/nexus-errors
```

## Usage

### Example with Sentry

```ts
import { registerExceptionHandler, registerMessageHandler } from "@uplift-ltd/nexus-errors";
import { captureException, captureMessage } from "@sentry/remix";

registerExceptionHandler(captureException);
registerMessageHandler(captureMessage);
```

## API

### registerExceptionHandler

```ts
import { registerExceptionHandler } from "@uplift-ltd/nexus-errors";
import { captureException } from "@sentry/remix";

registerExceptionHandler(captureException);
```

### registerMessageHandler

```ts
import { registerMessageHandler } from "@uplift-ltd/nexus-errors";
import { captureMessage } from "@sentry/remix";

registerMessageHandler(captureMessage);
```

### Override Types

Here's an example for using Sentry types.

```ts
import "@uplift-ltd/nexus-errors";

declare module "@uplift-ltd/nexus-errors" {
  import { type CaptureContext } from "@sentry/types";

  export interface NexusExceptionHandlerProps {
    error: any;
    context: CaptureContext;
  }

  export interface NexusMessageHndlerProps {
    message: string;
    context: CaptureContext;
  }
}
```
