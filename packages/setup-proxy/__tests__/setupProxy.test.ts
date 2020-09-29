import { createProxyMiddleware } from "http-proxy-middleware";
import { setupProxy, DEFAULT_TARGET, DEFAULT_PROXY_PATHS, ProxyOptions } from "../src/setupProxy";

jest.mock("http-proxy-middleware", () => ({ createProxyMiddleware: jest.fn() }));

describe("setupProxy", () => {
  it("should work with no callback", () => {
    const app = { use: jest.fn() };

    setupProxy()(app as any);

    expect(app.use).toHaveBeenCalled();

    expect(createProxyMiddleware).toHaveBeenCalledWith(DEFAULT_PROXY_PATHS, {
      target: DEFAULT_TARGET,
      changeOrigin: true,
    });
  });

  it("should fall back to defaults if callback returns undefined", () => {
    const callback = jest.fn();

    setupProxy(callback);

    expect(callback).toHaveBeenCalledWith({
      target: DEFAULT_TARGET,
      proxyPaths: DEFAULT_PROXY_PATHS,
    });
  });

  it("should fall back to defaults if callback returns partial result", () => {
    const callback = jest.fn((() => ({ target: "http://localhost:3000" })) as () => ProxyOptions);
    const app = { use: jest.fn() };

    setupProxy(callback)(app as any);

    expect(callback).toHaveBeenCalledWith({
      target: DEFAULT_TARGET,
      proxyPaths: DEFAULT_PROXY_PATHS,
    });

    expect(createProxyMiddleware).toHaveBeenCalledWith(DEFAULT_PROXY_PATHS, {
      target: "http://localhost:3000",
      changeOrigin: true,
    });
  });
});
