#!/usr/bin/env node

import path from "path";
import fs from "fs";

function initFiles() {
  const pkgPath = path.resolve("package.json");

  const name = path.parse(process.cwd()).name;

  const pkg = {
    name: `@uplift-ltd/${name}`,
    version: "0.1.0",
    description: name,
    license: "UNLICENSED",
    author: "Uplift Agency Ltd. <npm@uplift.ltd>",
    main: "./dest/index.js",
    files: ["./dest/", "README.md"],
    publishConfig: {
      registry: "https://npm.pkg.github.com/",
    },
    repository: {
      type: "git",
      url: "git+https://github.com/uplift-ltd/nexus.git",
      directory: `packages/${name}`,
    },
    bugs: {
      url: `https://github.com/uplift-ltd/nexus/issues?q=is:open+is:issue+label:${name}`,
    },
    homepage: `https://nexus.uplift.sh/docs/packages/${name}`,
    scripts: {
      build: "tsc",
      test: "jest",
    },
    dependencies: {},
    peerDependencies: {},
    devDependencies: {},
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}
