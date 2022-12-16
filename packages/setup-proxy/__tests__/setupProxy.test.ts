import { createProxyMiddleware } from "http-proxy-middleware";
import { DEFAULT_TARGET, DEFAULT_PROXY_PATHS } from "../src/constants";
import { setupProxy } from "../src/setupProxy";

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

    setupProxy({ target: "http://127.0.0.1:3000" })(app as any);

    expect(createProxyMiddleware).toHaveBeenCalledWith(DEFAULT_PROXY_PATHS, {
      target: "http://127.0.0.1:3000",
      changeOrigin: true,
    });
  });
});
