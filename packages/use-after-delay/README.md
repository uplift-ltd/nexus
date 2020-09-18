# @uplift-ltd/use-after-delay

## Installation

    yarn add @uplift-ltd/use-after-delay

## API

### useAfterDelay

Set a timeout to delay an action, such as showing a loader.

```ts
import { useAfterDelay } from "@uplift-ltd/use-after-delay";

const pastDelay = useAfterDelay(250);

if (!pastDelay) {
  return null;
}

return <Loading>
```
