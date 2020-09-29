const proxy = require("http-proxy-middleware");

const DEFAULT_TARGET = "http://localhost:5000";

const REST_URL = "/api";
const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL || "/logout";

const DEFAULT_PROXY_PATHS = [
  "/admin/",
  "/static/admin",
  "/static/graphene_django",
  "/graphql/",
  "/auth/graphql/",
  "/batch/graphql/",
  "/batch/auth/graphql/",
  REST_URL,
  LOGOUT_URL,
];

// Create a file in src/setupProxy.js that invokes this function with a callback that returns a config.
//
// module.exports = require("@uplift-ltd/apollo/setupProxy")(({ target, proxyPaths }) => ({
//   target: process.env.REACT_APP_PROXY_TARGET || target,
//   proxyPaths: proxyPaths.filter((proxyPath) => proxyPath.indexOf("logout") !== -1),
// }));
//
// Or use the default values:
//
// module.exports = require("@uplift-ltd/apollo/setupProxy")();

module.exports = (callback = () => ({})) => {
  const { target = DEFAULT_TARGET, proxyPaths = DEFAULT_PROXY_PATHS } = callback({
    target: DEFAULT_TARGET,
    proxyPaths: DEFAULT_PROXY_PATHS,
  });

  return (app) =>
    app.use(
      proxy(proxyPaths, {
        target,
        changeOrigin: true,
      })
    );
};
