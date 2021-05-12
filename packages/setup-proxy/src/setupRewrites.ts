import { DEFAULT_PROXY_PATHS, DEFAULT_TARGET } from "./constants";

export function setupRewrites({ target = DEFAULT_TARGET, proxyPaths = DEFAULT_PROXY_PATHS } = {}) {
  return proxyPaths
    .map((path) => {
      const source = path;
      const destination = `${target}${path}`;
      let sourceWild = source;
      let destinationWild = destination;
      if (source.endsWith("/")) {
        sourceWild += ":path*/";
        destinationWild += ":path*/";
      } else {
        sourceWild += "/:path*";
        destinationWild += "/:path*";
      }
      return [
        { source, destination },
        { source: sourceWild, destination: destinationWild },
      ];
    })
    .flat();
}
