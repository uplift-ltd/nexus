import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { DEFAULT_PROXY_PATHS, DEFAULT_TARGET } from "./constants.js";

type ProxyTarget = string;
type ProxyPaths = string[];

export interface ProxyOptions {
  target: ProxyTarget;
  proxyPaths: ProxyPaths;
}

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
