#!/usr/bin/env node

import { Command } from "commander";
import execa from "execa";

const program = new Command();

program.version("1.0.0");

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
    }
  });

program.command("clean-library").action(async (script, options) => {
  try {
    const clean = await execa("rm", ["-rf", "esm", "cjs"]);
    if (clean.all) {
      console.info(clean.all);
    } else {
      console.info("Nexus clean-library done!");
    }
  } catch (err) {
    console.error(err);
  }
});

program.parse(process.argv);

export default program;
