# @uplift-ltd/setup-proxy

## Installation

    yarn add @uplift-ltd/setup-proxy

## API

Create a file in src/setupProxy.js that invokes this function with a callback that returns a config
(or omit the callback to use default values).

### Default Values

```js
module.exports = require("@uplift-ltd/setup-proxy")();
```

### Custom Values

```js
module.exports = require("@uplift-ltd/setupProxy")(({ target, proxyPaths }) => ({
  target: process.env.REACT_APP_PROXY_TARGET || "http://localhost:5000",
  proxyPaths: proxyPaths.filter((proxyPath) => proxyPath.indexOf("logout") !== -1),
}));
```
