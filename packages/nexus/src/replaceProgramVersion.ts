import path from "path";
import readPackageUp from "read-pkg-up";
import replaceInFile from "replace-in-file";

export async function replaceProgramVersion() {
  const pkg = await readPackageUp();

  if (!pkg) {
    throw new Error("Could not find package.json");
  }

  const dir = path.dirname(pkg.path);
  const cjsPath = path.join(dir, "./cjs/*.js");
  const esmPath = path.join(dir, "./esm/*.js");

  const options = {
    files: [cjsPath, esmPath],
    from: /program\.version\((.+)\)/,
    // format differently so we don't replace in this file (the compiled one)
    // eslint-disable-next-line no-useless-concat
    to: "program.version" + `(${JSON.stringify(pkg.packageJson.version)})`,
  };

  return replaceInFile.replaceInFile(options);
}
