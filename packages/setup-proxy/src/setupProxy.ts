import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { DEFAULT_PROXY_PATHS, DEFAULT_TARGET } from "./constants.js";

type ProxyTarget = string;
type ProxyPaths = string[];

export interface ProxyOptions {
  proxyPaths: ProxyPaths;
  target: ProxyTarget;
}

export const setupProxy = (
  { proxyPaths = DEFAULT_PROXY_PATHS, target = DEFAULT_TARGET }: Partial<ProxyOptions> = {
    proxyPaths: DEFAULT_PROXY_PATHS,
    target: DEFAULT_TARGET,
  }
) => {
  return (app: Express) =>
    app.use(
      createProxyMiddleware(proxyPaths, {
        changeOrigin: true,
        target,
      })
    );
};
