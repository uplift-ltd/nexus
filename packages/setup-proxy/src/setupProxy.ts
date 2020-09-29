import { createProxyMiddleware } from "http-proxy-middleware";
import { Express } from "express";

type ProxyTarget = string;
type ProxyPaths = string[];

export interface ProxyOptions {
  target: ProxyTarget;
  proxyPaths: ProxyPaths;
}

export const DEFAULT_TARGET = "http://localhost:5000";

const REST_URL = "/api";
const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL || "/logout";

export const DEFAULT_PROXY_PATHS = [
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

export const setupProxy = (
  { target = DEFAULT_TARGET, proxyPaths = DEFAULT_PROXY_PATHS }: Partial<ProxyOptions> = {
    target: DEFAULT_TARGET,
    proxyPaths: DEFAULT_PROXY_PATHS,
  }
) => {
  return (app: Express) =>
    app.use(
      createProxyMiddleware(proxyPaths, {
        target,
        changeOrigin: true,
      })
    );
};
