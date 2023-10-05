import { DEFAULT_PROXY_PATHS, DEFAULT_TARGET } from "./constants.js";

export function setupRewrites({ proxyPaths = DEFAULT_PROXY_PATHS, target = DEFAULT_TARGET } = {}) {
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
        { destination, source },
        { destination: destinationWild, source: sourceWild },
      ];
    })
    .flat();
}
