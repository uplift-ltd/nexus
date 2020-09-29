# @uplift-ltd/setup-proxy

## Installation

    yarn add @uplift-ltd/setup-proxy

## API

Create a file in src/setupProxy.js that invokes this function with a callback that returns a config
(or omit the callback to use default values).

### Default Values

```js
const { setupProxy } = require("@uplift-ltd/setup-proxy");
module.exports = setupProxy();
```

### Custom Values

```js
const { setupProxy, DEFAULT_TARGET, DEFAULT_PROXY_PATHS } = require("@uplift-ltd/setup-proxy");

module.exports = setupProxy({
  target: "http://localhost:5000",
  proxyPaths: DEFAULT_PROXY_PATHS.filter((proxyPath) => proxyPath.indexOf("logout") !== -1),
});
```
