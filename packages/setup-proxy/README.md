# @uplift-ltd/setup-proxy

## Installation

```sh
npm i --save @uplift-ltd/setup-proxy
```

## API

Create a file in src/setupProxy.js that invokes this function with a callback that returns a config
(or omit the callback to use default values).

### Default Values

```js
const { setupProxy } = require("@uplift-ltd/setup-proxy");
module.exports = setupProxy();
```

### Package Proxy

```js
const { setupProxy } = require("@uplift-ltd/setup-proxy");
const pkg = require("../package.json");
module.exports = setupProxy({ target: pkg.proxy });
```

### Custom Values

```js
const { setupProxy, DEFAULT_TARGET, DEFAULT_PROXY_PATHS } = require("@uplift-ltd/setup-proxy");

module.exports = setupProxy({
  target: "http://127.0.0.1:8000",
  proxyPaths: DEFAULT_PROXY_PATHS.filter((proxyPath) => proxyPath.indexOf("logout") !== -1),
});
```

### Next.js

```js
const { setupRewrites } = require("@uplift-ltd/setup-proxy");

module.exports = {
  trailingSlash: true,
  rewrites: () => setupRewrites(),
};
```
