#!/usr/bin/env node

import { Command } from "commander";
import { execa } from "execa";
import fs from "fs/promises";

import { getAppId, getAppspecName, loadConfig } from "./config.js";

const program = new Command();

program.version("1.0.0");

program
  .command("appspec:get")
  .requiredOption("-e, --env <env>", "environment (key from package.json)")
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const APP_ID = getAppId(config, options.env);
      const appspecName = getAppspecName(options.env);

      const appspec = await execa("doctl", [
        "apps",
        "spec",
        "get",
        APP_ID,
        "--context",
        config.context,
      ]);

      await fs.writeFile(appspecName, appspec.stdout, "utf-8");

      const prettier = await execa("./node_modules/.bin/prettier", ["--write", appspecName]);

      if (prettier.stdout) {
        console.info(prettier.stdout);
      } else {
        console.info(`Wrote ${appspecName}`);
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program
  .command("appspec:update")
  .requiredOption("-e, --env <env>", "environment (key from package.json)")
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const APP_ID = getAppId(config, options.env);
      const appspecName = getAppspecName(options.env);

      const appspec = await execa("doctl", [
        "apps",
        "update",
        APP_ID,
        "--spec",
        appspecName,
        "--context",
        config.context,
      ]);

      if (appspec.stdout) {
        console.info(appspec.stdout);
      } else {
        console.info(`Updated appspec for ${APP_ID}`);
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program
  .command("create-deployment")
  .requiredOption("-e, --env <env>", "environment (key from package.json)")
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const APP_ID = getAppId(config, options.env);

      const appspec = await execa("doctl", [
        "apps",
        "create-deployment",
        APP_ID,
        "--context",
        config.context,
      ]);

      if (appspec.stdout) {
        console.info(appspec.stdout);
      } else {
        console.info(`Created deployment for ${APP_ID}`);
      }
    } catch (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);

export default program;
