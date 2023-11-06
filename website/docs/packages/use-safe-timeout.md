---
title: use-safe-timeout
---

## Installation

```sh
npm i --save @uplift-ltd/use-safe-timeout
```

## API

### useSafeTimeout

Returns a function to cancel the timeout

```tsx
import { useSafeTimeout } from "@uplift-ltd/use-safe-timeout";

function MyComponent() {
  const setSafeTimeout = useSafeTimeout();
  const cancelTimeout = setSafeTimeout(
    () => console.log("I get called in 5s if component stays mounted!"),
    5000
  );
  return <button onClick={cancelTimeout}>Cancel Timeout</button>;
}
```
