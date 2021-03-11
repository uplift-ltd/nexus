# @uplift-ltd/use-interval

## Installation

    yarn add @uplift-ltd/use-interval

## API

### useInterval

A hook for setting intervals based on
[this article](https://overreacted.io/making-setinterval-declarative-with-react-hooks/).

```ts
import { useInterval } from "@uplift-ltd/use-interval";

function MyComponent() {
  useInterval(() => {
    console.log("hii");
  }, 1000);
}
```

### useSyncedInterval

A hook for setting synced intervals. Use this if you have intervals in different parts of the app
that should execute at the same time.

```tsx
import { SyncedIntervalProvider, useSyncedInterval } from "@uplift-ltd/use-interval";

function Root() {
  return (
    <SyncedIntervalProvider defaultDelay={10000}>
      <SomeComponent />
      <OtherComponent />
    </SyncedIntervalProvider>
  );
}

function SomeComponent() {
  useSyncedInterval(
    () => {
      console.log("Ping!");
    },
    1000,
    "optionalChannel"
  );
  return null;
}

function OtherComponent() {
  useSyncedInterval(
    () => {
      console.log("Pong!");
    },
    2000,
    "optionalChannel"
  );
  return null;
}
```

You can optionally specify a channel to have multiple groups of synced intervals. For example 2
intervals that run every 10s and 3 intervals that run every 2s.

The hook will use the **last** delay that was mounted, so in the example above it should be `2000`
until `OtherComponent` unmounts, at which point it will become `1000`. See below how to specify only
callbacks.

The callbacks leverage a `ref` under the hood, so you technically don't have to use `useCallback`
for the callback, but it is recommended. Changing the delay will cause a re-render.

### useSyncedIntervalCallback

Same as `useSyncedInterval` but without specifying a delay. It will use the last delay specified of
the `defaultDelay` passed to `SyncedIntervalProvider`.

```tsx
import { useSyncedIntervalCallback } from "@uplift-ltd/use-interval";

function OtherComponent() {
  useSyncedIntervalCallback(() => {
    console.log("Pong!");
  }, "optionalChannel");
  return null;
}
```

### useSyncedIntervalDelay

Same as `useSyncedIntervalCallback` but only specifying the delay instead.

```tsx
import { useSyncedIntervalCallback } from "@uplift-ltd/use-interval";

function OtherComponent() {
  useSyncedIntervalCallback(3000, "optionalChannel");
  return null;
}
```
