# @uplift-ltd/setup-proxy

## Installation

```sh
npm i --save @uplift-ltd/setup-proxy
```

## API

Create a file in src/setupProxy.js that invokes this function with a callback that returns a config
(or omit the callback to use default values).

### Default Values

```ts
// next.config.ts
export const GRAPHQL_ORIGIN = process.env.GRAPHQL_ORIGIN || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return setupRewrites({
      target: GRAPHQL_ORIGIN,
    });
  },
};

export default nextConfig;
```
