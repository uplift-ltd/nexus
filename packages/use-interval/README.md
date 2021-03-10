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
