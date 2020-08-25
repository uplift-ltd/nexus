#!/usr/bin/env node

import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

const indexTemplate = fs.readFileSync(path.resolve(__dirname, "../src/fixtures/index.ts"));
const todoTemplate = fs.readFileSync(path.resolve(__dirname, "../src/fixtures/todo.ts"));

export function initFiles() {
  const pkgPath = path.resolve("package.json");
  const pkgDir = path.dirname(pkgPath);
  const pkgName = path.parse(pkgDir).name;

  const pkg = {
    name: `@uplift-ltd/${pkgName}`,
    version: "0.1.0",
    description: pkgName,
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
      directory: `packages/${pkgName}`,
    },
    bugs: {
      url: `https://github.com/uplift-ltd/nexus/issues?q=is:open+is:issue+label:${pkgName}`,
    },
    homepage: `https://nexus.uplift.sh/docs/packages/${pkgName}`,
    scripts: {
      build: "tsc",
      test: "jest",
    },
    dependencies: {},
    peerDependencies: {},
    devDependencies: {},
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  const srcDir = path.join(pkgDir, "src");

  mkdirp.sync("srcDir");

  fs.writeFileSync(path.join(srcDir, "index.ts"), indexTemplate);
  fs.writeFileSync(path.join(srcDir, "todo.ts"), todoTemplate);
}

initFiles();
