import { createProxyMiddleware } from "http-proxy-middleware";
import { DEFAULT_PROXY_PATHS, DEFAULT_TARGET } from "../src/constants.js";
import { setupProxy } from "../src/setupProxy.js";

jest.mock("http-proxy-middleware", () => ({ createProxyMiddleware: jest.fn() }));

describe("setupProxy", () => {
  it("should work with no options", () => {
    const app = { use: jest.fn() };

    setupProxy()(app as any);

    expect(app.use).toHaveBeenCalled();

    expect(createProxyMiddleware).toHaveBeenCalledWith(DEFAULT_PROXY_PATHS, {
      changeOrigin: true,
      target: DEFAULT_TARGET,
    });
  });

  it("should fall back to defaults if callback returns partial result", () => {
    const app = { use: jest.fn() };

    setupProxy({ target: "http://127.0.0.1:3000" })(app as any);

    expect(createProxyMiddleware).toHaveBeenCalledWith(DEFAULT_PROXY_PATHS, {
      changeOrigin: true,
      target: "http://127.0.0.1:3000",
    });
  });
});
