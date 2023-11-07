---
title: use-on-page-scroll
---

## Installation

```sh
npm i --save @uplift-ltd/use-on-page-scroll
```

## API

### useOnPageScroll

Hook to handle scroll up/down events. Returns current and previous y position. Cleans up after
itself.

```ts
import { useOnPageScroll } from "@uplift-ltd/use-on-page-scroll";

useOnPageScroll({
  onScrollUp: ([newYPosition, lastYPosition]) => {
    console.log(newYPosition, lastYPosition);
  },
  onScrollDown: ([newYPosition, lastYPosition]) => {
    console.log(newYPosition, lastYPosition);
  },
});
```
