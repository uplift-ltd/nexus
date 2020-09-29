import { createProxyMiddleware } from "http-proxy-middleware";
import { setupProxy, DEFAULT_TARGET, DEFAULT_PROXY_PATHS, ProxyOptions } from "../src/setupProxy";

jest.mock("http-proxy-middleware", () => ({ createProxyMiddleware: jest.fn() }));

describe("setupProxy", () => {
  it("should work with no options", () => {
    const app = { use: jest.fn() };

    setupProxy()(app as any);

    expect(app.use).toHaveBeenCalled();

    expect(createProxyMiddleware).toHaveBeenCalledWith(DEFAULT_PROXY_PATHS, {
      target: DEFAULT_TARGET,
      changeOrigin: true,
    });
  });

  it("should fall back to defaults if callback returns partial result", () => {
    const app = { use: jest.fn() };

    setupProxy({ target: "http://localhost:3000" })(app as any);

    expect(createProxyMiddleware).toHaveBeenCalledWith(DEFAULT_PROXY_PATHS, {
      target: "http://localhost:3000",
      changeOrigin: true,
    });
  });
});
