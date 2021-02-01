#!/usr/bin/env node

import fs from "fs";
import path from "path";
import ejs from "ejs";
import globby from "globby";
import zip from "lodash/zip";
import mkdirp from "mkdirp";

export async function initFiles() {
  const pkgPath = path.resolve("package.json");
  const pkgDir = path.dirname(pkgPath);
  const pkgName = path.parse(pkgDir).name;

  const fixturePaths = await globby(path.resolve(__dirname, "../fixtures/**/*"));
  const relativePaths = fixturePaths.map((fixturePath) => fixturePath.replace(/.+fixtures\//, ""));
  const pkgPaths = relativePaths.map((relativePath) => path.resolve(pkgDir, relativePath));

  await Promise.all(
    zip(fixturePaths, pkgPaths, relativePaths).map(
      async ([fixturePath, destPath, relativePath]) => {
        if (!fixturePath || !destPath || !relativePath) {
          throw new Error("Lodash types are wrong");
        }

        const fixture = await fs.promises.readFile(fixturePath as string, "utf-8");
        await mkdirp(path.dirname(destPath));
        await fs.promises.writeFile(destPath, ejs.render(fixture, { PACKAGE_NAME: pkgName }));
        console.info(`Wrote ${relativePath}`);
      }
    )
  );
}

initFiles();
