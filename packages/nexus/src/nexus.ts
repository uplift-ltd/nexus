#!/usr/bin/env node

import { Command } from "commander";
// On CI only, we get this: Error: @uplift-ltd/nexus: src/nexus.ts(4,19): error TS7016: Could not find a declaration file for module 'execa'. '/home/runner/work/nexus/nexus/node_modules/execa/index.js' implicitly has an 'any' type.
// Seems like TypeScript is looking at the root node_modules/execa instead of the one here.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import execa from "execa";

const program = new Command();

program.version(process.env.NEXUS_PACKAGE_VERSION || "1.0.0");

program
  .command("build-library")
  .option("--tsconfig <path>", "Path to tsconfig.json", "tsconfig.json")
  .action(async (script, options) => {
    try {
      const cjs = await execa("tsc", [
        "-p",
        script.tsconfig,
        "--outDir",
        "./cjs",
        "--module",
        "commonjs",
      ]);
      if (cjs.all) {
        console.info(cjs.all);
      }
      const esm = await execa("tsc", [
        "-p",
        script.tsconfig,
        "--outDir",
        "./esm",
        "--module",
        "es2020",
      ]);
      if (esm.all) {
        console.info(esm.all);
      }
      if (!cjs.all && !esm.all) {
        console.info("Nexus build-library done!");
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.command("clean-library").action(async (script, options) => {
  try {
    const clean = await execa("git", ["clean", "-dfx", "cjs", "esm"]);
    if (clean.all) {
      console.info(clean.all);
    } else {
      console.info("Nexus clean-library done!");
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
});

program.parse(process.argv);

export default program;
