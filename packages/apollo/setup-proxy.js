const proxy = require("http-proxy-middleware");

const REST_URL = "/api";
const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL || "/logout";

const PROXY_PATHS = [
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

module.exports = (app) => {
  app.use(
    proxy(PROXY_PATHS, {
      target: "http://localhost:5000/",
      changeOrigin: true,
    })
  );
};
